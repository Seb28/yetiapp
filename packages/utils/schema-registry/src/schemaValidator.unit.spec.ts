import assert from 'assert'
import fs from 'fs'
import { SchemaValidator } from './schemaValidator'

const coordinatesJsonSchema = JSON.parse(
  fs.readFileSync('resources/test/coordinates.json', 'utf8')
)

describe('SchemaRegistry.validate', () => {
  it('should throw on invalid message', () => {
    const schemaValidator = new SchemaValidator(coordinatesJsonSchema)
    const invalidCoordinates = {
      latitude: 100, // Should fail as value is not between -90 and 90
      longitude: 80,
    }

    try {
      schemaValidator.validate(invalidCoordinates)
    } catch (e) {
      assert.ok(e.includes('instance.latitude must have a maximum value of 90'))
      return
    }
    assert.fail('An error should have been caught at this point')
  })

  it('should not throw if message is valid', () => {
    const schemaValidator = new SchemaValidator(coordinatesJsonSchema)
    const validCoordinates = {
      latitude: 17,
      longitude: -17,
    }

    try {
      schemaValidator.validate(validCoordinates)
    } catch (e) {
      assert.fail('No error should have been caught, got', e)
    }
    assert(true)
  })
})
