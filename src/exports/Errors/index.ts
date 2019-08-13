export class MalformedPayloadError extends Error {
  constructor(message: string) {
    super(message);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, MalformedPayloadError.prototype);
  }
}
