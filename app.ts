import express, { Express } from "express";
import DbConn from "./utils/db-conn";
import DocumentsDal from "./documents/documents-dal";
import ErrorMiddleware from "./utils/error-middleware";
import DocumentService from "./documents/documents-service";
import DocumentApi from "./documents/documents-api";
import HistoryDal from "./history/history-dal";
import HistoryService from "./history/history-service";
import historyApi from "./history/history-api";
import HistoryApi from "./history/history-api";
import DocumentMiddlewares from "./documents/middlewares";


const HOST = "127.0.0.1";
const PORT = 5000;

export default class App {
    private app: Express;
    private dbConn!: DbConn;

    constructor() {
        this.app = express();
    }
    async init() {
        this.dbConn = new DbConn();
        await this.dbConn.init();

  

        const documentsDal = new DocumentsDal(this.dbConn);
        const documentService = new DocumentService(documentsDal);
        const documentApi = new DocumentApi(documentService,);

        const historyDal = new HistoryDal(this.dbConn);
        const historyService = new HistoryService(historyDal);
        const historyApi = new HistoryApi(historyService);
        const documentMiddleware = new DocumentMiddlewares(historyService);

        this.setRoutes(documentApi, historyApi);
    }

    private setRoutes(documentApi: DocumentApi, historyApi: HistoryApi) {
        this.app.use(express.json());
        this.app.use("/api/documents", documentApi.router);
        this.app.use("/api/history", historyApi.router);
        this.app.use(ErrorMiddleware.errorHandler);

        this.app.listen(PORT, HOST, () => {
            console.log(`Listening on: http://${HOST}:${PORT}`);
        });
    }

    async terminate() {
        if (this.dbConn) {
            await this.dbConn.terminate();
        }
    }
}