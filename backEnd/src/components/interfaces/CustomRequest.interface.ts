import { Session } from 'express-session';

export default interface CustomRequest extends Request {
  session: Session & { username?: string, userId?: number };
}
