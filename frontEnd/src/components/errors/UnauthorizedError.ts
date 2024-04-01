export default class UnauthorizedError extends Error {
  constructor(message = "Unauthorized Access") {
    super(message);
  }
}
