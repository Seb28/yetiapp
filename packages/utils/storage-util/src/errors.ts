export class StorageUtilError extends Error {
  constructor(message?: string) {
    super(message)
    // see: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#support-for-newtarget
    Object.setPrototypeOf(this, new.target.prototype) // restore prototype chain
    this.name = StorageUtilError.name // stack traces display correctly now
  }

  static fromError(message: string, error: Error): StorageUtilError {
    return new StorageUtilError(`${message}: '${error.message}'`)
  }
}
