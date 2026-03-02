import { Router } from "express";
import HistoryService from "./history-service";
import { Request, Response } from "express";
import DocumentMiddlewares from "../documents/document-middlewares";
import { GetHistoryOptions, OperationType } from "./model";
import ErrorMiddleware from "../utils/error-middleware";

export default class DocumentApi {
    public router: Router;

    constructor(private historyService: HistoryService) {
        this.router = Router();
        this.setRoutes();
    }

    private setRoutes() {

        this.router.get("/", DocumentMiddlewares.hasUserId, this.getHistory.bind(this), ErrorMiddleware.errorHandler);
        this.router.delete("/", DocumentMiddlewares.hasUserId, this.clearHistory.bind(this));


    }

    private async getHistory(req: Request, res: Response) {
        const options: GetHistoryOptions = {
            pathPrefix: req.query.pathPrefix as string,
            user: req.query.user as string,
            documentId: req.query.documentId as string,
            documentAuthor: req.query.documentAuthor as string,
            operationType: req.query.operationType as OperationType,
            page: req.query.page ? Number(req.query.page) : 1,
            limit: 5,
        };

        const documentsHistory = await this.historyService.getHistory(options);
        res.send(documentsHistory);
    }
    private async clearHistory(req: Request, res: Response) {
        await this.historyService.clearHistory();
        res.status(204).send();
    }
}