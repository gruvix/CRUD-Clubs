export default class TeamNotResettableError extends Error {
    constructor(message = "Team lacks default values, it is not resettable") {
      super(message);
    }
  }
  