export default class UserNotFoundError extends Error {
    constructor(message = "User not found") {
      super(message);
    }
  }
  