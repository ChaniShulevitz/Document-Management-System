import { Request, Response, NextFunction } from "express";
import HistoryService from "../history/history-service";
import historyDal from "../history/history-dal";
import historyService from "../utils/static-instance";
import { MyDocument } from "./models";

export default class DocumentMiddlewares {

  static hasUserId(req: Request, res: Response, next: NextFunction) {
    const userId = req.header("X-User-Id");


    if (!DocumentMiddlewares.validateId(userId as any)) {
      return res.status(401).send("user-id required")
    }
    req.userId = userId;
    next();
  }
  static async HistoryMiddleware(req: Request, res: Response, next: NextFunction) {

    const details = res.locals.documentDetails;
    const operationType = res.locals.operationType;

    if (!details) {
      return next();
    }

   await historyService.toInsert({
    user: req.userId,
    documentId: details.id,
    documentPath: details.path,
    documentAuthor: details.author,
    timeStamp: new Date(),
    operationType,
});


    next();
  }




  private static validateId(id: string): boolean {
    if (id && id.length === 8) {
      return true;
    }
    return false;
  }

  static isDocumentValid(document: MyDocument): { status: boolean, error: string } {
    if (!document) {
      return { status: false, error: "Body is empty" };
    }

    if (!DocumentMiddlewares.validateId(document.id)) {
      return { status: false, error: "Document ID is invalid" };
    }

    if (!document.path) {
      return { status: false, error: "Document path is required" };
    }

    if (!document.content) {
      return { status: false, error: "Document content is required" };
    }

    if (!document.title) {
      return { status: false, error: "Document title is required" };
    }
    return { status: true, error: "" };
  }


}