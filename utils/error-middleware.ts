import { NextFunction, Request, Response } from "express";

export default class ErrorMiddleware {
    static errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
        console.error(err);

        res.status(500).send("Error occurred in server. Contact support for help.");
    }
}