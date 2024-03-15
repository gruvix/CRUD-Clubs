import { NextFunction, Request, Response } from "express"

interface SessionData {
    username: string   
}
interface File {
    filename: string
}
declare module 'express' {
    interface Request {
        session: SessionData,
        file: File,
    }
}
export default interface use {
    req: Request,
    res: Response,
    next: NextFunction,
}