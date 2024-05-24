export default class PlayerNotFoundError extends Error {
  constructor(message = "Player Not Found") {
    super(message);
  }
}
