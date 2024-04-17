export default class NoDataProvidedError extends Error {
    constructor(message = "No data provided") {
      super(message);
    }
  }
  