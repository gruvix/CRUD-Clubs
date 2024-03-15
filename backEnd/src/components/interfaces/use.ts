import { NextFunction, Request, Response } from "express"

interface SessionData {
    username: string
}
declare module 'express' {
    interface Request {
        session: SessionData
    }
}
export default interface use {
    req: Request,
    res: Response,
    next: NextFunction,
}