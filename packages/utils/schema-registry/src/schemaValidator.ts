import { Schema, Validator } from 'jsonschema'

export class SchemaValidator {
  private schema: Schema
  private validator: Validator

  constructor(mainSchema: Schema, additionalSchemas?: Schema[]) {
    this.schema = mainSchema
    this.validator = new Validator() // This won't fail on construction...
    additionalSchemas?.forEach(s => this.validator.addSchema(s, s.id))
  }

  validate(message: unknown): void {
    const validatorResult = this.validator.validate(message, this.schema)
    if (!validatorResult.valid) {
      throw `JSON Schema validation failed, got error(s): 
        ${validatorResult.errors.map(e => ' - ' + e.toString()).join('\n')}`
    }
  }
}
