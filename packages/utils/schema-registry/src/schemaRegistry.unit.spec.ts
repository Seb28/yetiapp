import assert from 'assert'
import fs from 'fs'
import sinon from 'sinon'

import { StorageUtil } from '@leclerc/storage-util'

import { SchemaRegistry } from './schemaRegistry'
import { RegistryCache } from './registryCache'
import { SchemaValidator } from './schemaValidator'

const coordinatesJsonSchema = JSON.parse(
  fs.readFileSync('resources/test/coordinates.json', 'utf8')
)

describe('SchemaRegistry.validate', () => {
  it('should use schema from and fail if message is invalid', async () => {
    const existingSchemaValidator = new SchemaValidator(coordinatesJsonSchema)
    const cache = new RegistryCache((null as any) as StorageUtil, 'test/path')
    sinon
      .stub(cache, 'getSchema')
      .returns(Promise.resolve(existingSchemaValidator))
    const schemaRegistry = new SchemaRegistry(cache)
    const invalidCoordinates = {
      latitude: 100, // Should fail as value is not between -90 and 90
      longitude: 80,
    }

    try {
      await schemaRegistry.validate(invalidCoordinates)
    } catch (e) {
      assert.ok(e.includes('instance.latitude must have a maximum value of 90'))
      return
    }
    assert.fail('An error should have been caught at this point')
  })

  it('should use schema from cache and fail if message is valid', async () => {
    const existingSchemaValidator = new SchemaValidator(coordinatesJsonSchema)
    const cache = new RegistryCache((null as any) as StorageUtil, 'test/path')
    sinon
      .stub(cache, 'getSchema')
      .returns(Promise.resolve(existingSchemaValidator))
    const schemaRegistry = new SchemaRegistry(cache)
    const validCoordinates = {
      latitude: 17,
      longitude: -17,
    }

    try {
      await schemaRegistry.validate(validCoordinates)
    } catch (e) {
      assert.fail('No error should have been caught, got', e)
    }
    assert(true)
  })
})
