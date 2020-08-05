import { RegistryCache } from './registryCache'

// const CONTENT_TYPE = "application/vnd.schemaregistry.v1+json"
// const SCHEMA_TYPE = "schema-registry-type"
// const TYPE = "json"
export class SchemaRegistry {
  private cache: RegistryCache

  constructor(cache: RegistryCache) {
    this.cache = cache
  }

  async validate<T>(message: T): Promise<void> {
    const schema = await this.cache.getSchema()
    schema.validate(message)
  }

  async validateMany<T>(messages: T[]): Promise<void> {
    const schema = await this.cache.getSchema()
    const logger = this.cache.logger
    logger.debug(
      `Validating ${messages.length} messages with schema ${JSON.stringify(
        schema
      )}`
    )
    messages.forEach(schema.validate)
  }
}
