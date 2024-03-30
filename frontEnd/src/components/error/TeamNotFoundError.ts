export default class TeamNotFoundError extends Error {
  constructor(message = "Team Not Found") {
    super(message);
  }
}
