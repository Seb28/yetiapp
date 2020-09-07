import * as m from 'mongodb'

export class MongoClient {
  uri: string
  db: string
  private unavailableErrorCode?: string
  private internalCient?: m.MongoClient

  constructor(uri: string, db: string, unavailableErrorCode?: string) {
    this.uri = uri
    this.db = db
    this.unavailableErrorCode = unavailableErrorCode
  }

  private async getClient(): Promise<m.MongoClient> {
    if (this.internalCient === undefined) {
      console.info('Initializing MongoDB client...')
      return m
        .connect(this.uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        .then(client => {
          console.debug('Connection successful')
          this.internalCient = client
          return this.internalCient
        })
        .catch(err => {
          const errorCode = this.unavailableErrorCode
          if (errorCode) {
            console.error(
              `${errorCode} - Unable to connect client to Mongo %o`,
              err
            )
          } else {
            console.error('Unable to connect client to Mongo %o', err)
          }
          throw err
        })
    } else {
      return Promise.resolve(this.internalCient)
    }
  }

  async close() {
    const client = await this.getClient()
    console.info('Closing connection...')
    await client.close()
    this.internalCient = undefined
  }

  async ping() {
    await this.withClient(async client => {
      await client
        .db(this.db)
        .admin()
        .ping()
    })
  }

  private withClient = <T>(f: (client: m.MongoClient) => Promise<T>) =>
    this.getClient().then(client => {
      if (client.isConnected()) {
        return f(client)
      } else {
        const message = 'Client is not connected...'
        console.warn(message)
        return Promise.reject(message)
      }
    })

  private getCollection(client: m.MongoClient, collection: string) {
    return client.db(this.db).collection(collection)
  }

  withCollection<T>(
    collection: string,
    f: (_collection: m.Collection) => Promise<T>
  ): Promise<T> {
    return this.withClient(async client => {
      return f(this.getCollection(client, collection))
    })
  }

  async transaction<T>(
    f: (session: m.ClientSession) => Promise<T>
  ): Promise<T> {
    return this.withClient(async client => {
      const session: m.ClientSession = client.startSession()
      session.startTransaction()
      try {
        const result = await f(session)
        await session.commitTransaction()
        return result
      } catch (e) {
        await session.abortTransaction()
        throw e
      } finally {
        session.endSession()
      }
    })
  }

  upsertMany<T>(
    collectionName: string,
    messages: T[],
    idFields: { [idFieldName: string]: (message: T) => unknown },
    session?: m.ClientSession
  ): Promise<m.BulkWriteOpResultObject> {
    return this.withCollection(collectionName, async collection => {
      const bulkUpdateOps = messages.map(message => {
        const filter = Object.entries(idFields).reduce(
          (acc, [key, accessor]) => ({ ...acc, [key]: accessor(message) }),
          {}
        )
        return {
          updateOne: {
            filter,
            update: { $set: message },
            upsert: true,
          },
        }
      })
      return collection.bulkWrite(bulkUpdateOps, { session })
    })
  }

  insertMany<T>(
    collectionName: string,
    messages: T[]
  ): Promise<m.BulkWriteOpResultObject> {
    return this.withCollection(collectionName, async collection => {
      const bulkInsertOps = messages.map(message => ({
        insertOne: { document: message },
      }))
      return collection.bulkWrite(bulkInsertOps)
    })
  }
}
