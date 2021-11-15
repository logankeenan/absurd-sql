export function BytesNotAvailable(message) {
    this.name = "BytesNotAvailable";
    this.message = message;

}
BytesNotAvailable.prototype = Error.prototype;