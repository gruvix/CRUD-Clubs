export default class InvalidUsernameError extends Error {
    constructor(message = "invalid username") {
      super(message);
    }
  }
  