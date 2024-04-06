export default class teamIsNotResettableError extends Error {
    constructor(message = "Team is not resettable") {
      super(message);
    }
  }
  