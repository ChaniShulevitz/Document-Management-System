import { Request, Response, NextFunction } from "express";
import historyDal from "../history/history-dal";
import { MyDocument } from "./models"

export default class DocumentMiddlewares {
  constructor(private historyService: any) { }
  static hasUserId(req: Request, res: Response, next: NextFunction) {
    const userId = req.header("X-User-Id");
    if (!DocumentMiddlewares.validateId(userId as any)) {
      return res.status(401).send("user-id required")
    }
    req.userId = userId;
    res.locals.userId = userId;
    next();
  }

  public HistoryMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    console.log("hi")
    const details = res.locals.documentDetails;
    const operationType = res.locals.operationType;
    const userId = res.locals.userId;

    if (!details || !operationType) {
      return next();
    }
    try {
      await this.historyService.toInsert({
        user: userId,
        documentId: details.id,
        documentPath: details.path,
        documentAuthor: details.author,
        timeStamp: new Date(),
        operationType: operationType,
      });
    } catch (error) {
      console.error("Failed to save history:", error);
    }
    next();
  };

  private static validateId(id: string): boolean {
    if (id && id.length === 8) {
      return true;
    }
    return false;
  }

  static isDocumentValidMiddleware(req: Request, res: Response, next: NextFunction) {
    const document: MyDocument = req.body;
    if (!document || !document.path || !document.content || !document.title) {
      return res.status(400).send({ error: "Invalid document" });
    }
    next();
  }


}