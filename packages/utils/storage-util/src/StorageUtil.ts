import * as Storage from '@google-cloud/storage'
import { consoleLogger } from '@yeti/logger-util'
import { Readable } from 'stream'
import { parseISO } from 'date-fns'
import util from 'util'
import * as stream from 'stream'
import { Logger } from 'winston'

import { StorageUtilError } from './errors'

export class StorageUtil {
  bucketName: string
  logger: Logger
  private storage: Storage.Storage

  constructor(bucketName: string, logger: Logger = consoleLogger()) {
    this.bucketName = bucketName
    this.logger = logger
    this.storage = new Storage.Storage()
  }

  getBucket(): Storage.Bucket {
    return this.storage.bucket(this.bucketName)
  }

  getReadable(fileName: string): Readable {
    const bucket = this.getBucket()
    const stream = bucket.file(fileName).createReadStream()
    stream.on('error', err => {
      this.logger.warn('Error on stream file %o', err)
    })
    stream.on('end', () => {
      this.logger.debug('File is fully downloaded')
    })
    return stream
  }

  async getContentFile(fileName: string): Promise<Buffer[]> {
    return this.getBucket()
      .file(fileName)
      .download()
  }

  async listFiles(path: string): Promise<Storage.File[]> {
    return this.getBucket()
      .getFiles({ prefix: path })
      .then(([files]) => files)
  }

  writeContentFile(fileName: string, fileContent: string) {
    return this.getBucket()
      .file(fileName)
      .save(fileContent)
  }

  createWriteStream(fileName: string) {
    return this.getBucket()
      .file(fileName)
      .createWriteStream()
  }

  putFile(filename: string, content: NodeJS.ReadableStream): Promise<unknown> {
    const bucket = this.getBucket()
    const file: Storage.File = bucket.file(filename)
    const pipeline = util.promisify(stream.pipeline)

    return new Promise(async (resolve, reject) => {
      const writable = file.createWriteStream({
        metadata: {
          contentType: 'application/zip, application/octet-stream',
        },
        resumable: false,
      })
      writable
        .on('error', err => {
          const message =
            'An error occured while storing file on Google Cloud Storage'
          this.logger.warn(message, err)
          reject(StorageUtilError.fromError(message, err))
        })
        .on('finish', () => {
          this.logger.info(`File ${filename} stored on Google Cloud Storage`)
          resolve()
        })
      await pipeline(content, writable)
    })
  }

  async copy(sourcePath: string, destPath: string): Promise<void> {
    this.logger.debug(`Copying file '${sourcePath}' to '${destPath}'`)
    await this.getBucket()
      .file(sourcePath)
      .copy(destPath)
  }

  async moveFileToOtherBucket(
    destinationBucket: string,
    sourcePath: string,
    destFilePath: string
  ) {
    this.logger.debug(
      `Moving file '${sourcePath}' to bucket '${destinationBucket}' at '${destFilePath}'`
    )
    const sourceBucket = this.getBucket()
    const sourceFile = sourceBucket.file(sourcePath)
    const destinationFile = `gs://${destinationBucket}/${destFilePath}`
    try {
      await sourceFile.move(destinationFile)
      this.logger.debug(
        `File '${sourcePath}' moved to bucket '${destinationBucket}' at '${destFilePath}'.`
      )
    } catch (e) {
      this.logger.warn('An error occured while moving file to the bucket %o', e)
    }
  }

  getLastFileNameFromDirectory(directory: string): Promise<string | undefined> {
    return this.getFileNameFromDirectoryByDate(
      directory,
      (lastModifiedFile, currentFile) => lastModifiedFile < currentFile
    )
  }

  getOldestFileNameFromDirectory(
    directory: string
  ): Promise<string | undefined> {
    return this.getFileNameFromDirectoryByDate(
      directory,
      (lastModifiedFile, currentFile) => lastModifiedFile > currentFile
    )
  }

  private async getFileNameFromDirectoryByDate(
    directory: string,
    keepCurrentFile: (lastModifiedFile: Date, currentFile: Date) => boolean
  ) {
    const response = await this.getBucket().getFiles({ directory: directory })
    const [entries] = response
    // Filter out directory entries (keep file entries only):
    const files = entries.filter(f => !f.name.endsWith('/'))
    return files.length > 0
      ? files.reduce((lastModifiedFile, currentFile) =>
          keepCurrentFile(
            parseISO(lastModifiedFile.metadata.updated),
            parseISO(currentFile.metadata.updated)
          )
            ? currentFile
            : lastModifiedFile
        ).name
      : undefined
  }
}
