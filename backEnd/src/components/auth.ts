import { NextFunction, Request, Response } from "express";

export function ensureLoggedIn ( req: any, res: Response, next: NextFunction ) {
  console.log(`Checking login status for User ${req.session.username}`);
  if (req.session.username) {
    console.log(`User ${req.session.username} is requesting ${req.path}`);
    next();
  } else {
    console.log('user not logged in');
    res.status(401).send();
  }
};
export function validateUsername(username: string) {
  const regexLettersWithNoDefault = /^[^\W\d_](?!default$)[^\W\d_]*$/i;
  if (!regexLettersWithNoDefault.test(username)) {
    return 'Invalid username';
  }
  return '';
}
