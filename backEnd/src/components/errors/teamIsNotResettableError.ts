export default class TeamIsNotResettableError extends Error {
    constructor(message = "Team is not resettable") {
      super(message);
    }
  }
  