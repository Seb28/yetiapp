import { consoleLogger } from 'logger-util'
import { StorageUtil } from 'storage-util'
import { SchemaValidator } from './schemaValidator'
import { Logger } from 'winston'

/**
 * This cache is designed only for Cloud Functions usage.
 * Therefore, no invalidation mechanism is designed here as the Cloud
 * Function timeout will handle it automatically.
 */
export class RegistryCache {
  private schemaValidator?: SchemaValidator
  private schemaPath: string
  private storage: StorageUtil
  logger: Logger

  constructor(
    storage: StorageUtil,
    schemaPath: string,
    defaultValue?: SchemaValidator,
    logger: Logger = consoleLogger()
  ) {
    this.storage = storage
    this.schemaPath = schemaPath
    this.schemaValidator = defaultValue
    this.logger = logger
  }

  async getSchema(): Promise<SchemaValidator> {
    if (this.schemaValidator === undefined)
      return this.getSchemaValidator().then(validator => {
        this.schemaValidator = validator
        return validator
      })
    return Promise.resolve(this.schemaValidator)
  }

  async getSchemaValidator(): Promise<SchemaValidator> {
    this.logger.info(`Getting schema at '${this.schemaPath}' from storage`)
    try {
      const [buffer] = await this.storage.getContentFile(this.schemaPath)
      return new SchemaValidator(JSON.parse(buffer.toString('utf-8')))
    } catch (e) {
      this.logger.error(
        `An error occured while validator schema from bucketName '${this.storage.bucketName}' at path '${this.schemaPath}'`,
        e
      )
      throw e
    }
  }
}
