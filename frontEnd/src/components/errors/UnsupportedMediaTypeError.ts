export default class UnsupportedMediaTypeError extends Error {
  constructor(message = "UnsupportedMediaTypeError") {
    super(message);
  }
}
