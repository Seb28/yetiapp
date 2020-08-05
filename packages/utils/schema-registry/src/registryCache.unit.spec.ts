import assert from 'assert'
import fs from 'fs'
import sinon from 'sinon'
import { StorageUtil } from '@yeti/storage-util'

import { RegistryCache } from './registryCache'
import { SchemaValidator } from './schemaValidator'

var coordinatesJsonSchema = JSON.parse(
  fs.readFileSync('resources/test/coordinates.json', 'utf8')
)
console.log(coordinatesJsonSchema)

describe('RegistryCache.validate', () => {
  it('should use existing schema if it exists', async () => {
    const existingSchemaValidator = new SchemaValidator(coordinatesJsonSchema)
    const cache = new RegistryCache(
      (null as any) as StorageUtil,
      'test/path',
      existingSchemaValidator
    )
    const spy = sinon.spy(cache, 'getSchemaValidator')

    await cache.getSchema()

    assert(spy.notCalled)
  })

  it('should fetch schema if it does not exist', async () => {
    const existingSchemaValidator = new SchemaValidator(coordinatesJsonSchema)
    const cache = new RegistryCache((null as any) as StorageUtil, 'test/path')
    const stub = sinon
      .stub(cache, 'getSchemaValidator')
      .returns(Promise.resolve(existingSchemaValidator))

    await cache.getSchema()

    assert(stub.calledOnce)
  })

  it('should not fetch schema once it has been fetched', async () => {
    const existingSchemaValidator = new SchemaValidator(coordinatesJsonSchema)
    const cache = new RegistryCache((null as any) as StorageUtil, 'test/path')
    const stub = sinon
      .stub(cache, 'getSchemaValidator')
      .returns(Promise.resolve(existingSchemaValidator))

    await cache.getSchema()
    await cache.getSchema()

    assert(!stub.calledTwice)
    assert(stub.calledOnce)
  })
})
