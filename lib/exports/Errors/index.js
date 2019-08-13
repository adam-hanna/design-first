"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MalformedPayloadError extends Error {
    constructor(message) {
        super(message);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, MalformedPayloadError.prototype);
    }
}
exports.MalformedPayloadError = MalformedPayloadError;
//# sourceMappingURL=index.js.map