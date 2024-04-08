export default class FileNotFoundError extends Error {
    constructor(message = "File not found") {
      super(message);
    }
  }
  