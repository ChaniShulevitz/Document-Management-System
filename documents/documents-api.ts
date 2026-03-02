import { Router } from "express";
import DocumentService from "./documents-service";
import { Request, Response } from "express";
import ErrorMiddleware from "../utils/error-middleware";
import DocumentMiddlewares from "./document-middlewares";




export default class DocumentApi {

    public router: Router;

    constructor(private documentService: DocumentService) {
        this.router = Router();
        this.setRoutes();
    }
    private setRoutes() {
        this.router.post("/", DocumentMiddlewares.hasUserId, DocumentMiddlewares.isDocumentValid, this.create.bind(this), DocumentMiddlewares.HistoryMiddleware, ErrorMiddleware.errorHandler);
        this.router.put("/:id", DocumentMiddlewares.hasUserId, DocumentMiddlewares.isDocumentValid, this.update.bind(this), DocumentMiddlewares.HistoryMiddleware, ErrorMiddleware.errorHandler);
        this.router.get("/:id", DocumentMiddlewares.hasUserId, this.getById.bind(this), ErrorMiddleware.errorHandler);
        this.router.get("/", DocumentMiddlewares.hasUserId, this.getAll.bind(this), ErrorMiddleware.errorHandler);
        this.router.delete("/:id", DocumentMiddlewares.hasUserId, this.delete.bind(this), DocumentMiddlewares.HistoryMiddleware, ErrorMiddleware.errorHandler);
       this.router.post("/", DocumentMiddlewares.hasUserId, this.create.bind(this),  ErrorMiddleware.errorHandler);
    }

    private async create(req: Request, res: Response) {
        const { path, title, content } = req.body;
        const result = await this.documentService.create({ path, title, content } as any);


        if (!result) {
            res.status(400).send();
            return;
        }

        res.locals.documentDetails = result;
        res.locals.operationType = "CREATE";

        res.status(201).send();
    }

    private async update(req: Request, res: Response) {
        const { author, path, title, content } = req.body;
        const { id } = req.params;

        const insert = await this.documentService.update({ id, author, path, title, content } as any);

        if (!insert) {
            res.status(400).send();
            return;
        }
        res.locals.documentDetails = insert;
        res.locals.operationType = "UPDATE";

        res.status(201).send();
    }

    private async getAll(req: Request, res: Response) {
        const { pathPrefix, author, sortBy } = req.query;
        const get = await this.documentService.getAll({ pathPrefix, author, sortBy } as any);
        if (!get) {
            res.status(400).send();
            return;
        }
        res.status(201).send();
    }

    private async getById(req: Request, res: Response) {
        const id = req.params;

        const getById = await this.documentService.getById(id as any);
        if (!getById) {
            res.status(400).send();
            return;
        }
        res.status(201).send();
    }


    private async delete(req: Request, res: Response) {
        const id = req.params;
        const deleted = await this.documentService.delete(id as any);
        if (!deleted) {
            return res.status(404).end();
        }

        res.locals.documentDetails = deleted;

        res.locals.operationType = "DELETE";

        res.end();

    }

    private async createPDF(req: Request, res: Response) {
        try {
            const {  title, content } = req.body;
            const pdfBuffer = await this.documentService.createPdf(title, content);
            const result = await this.documentService.create({  title, content, pdfBuffer } as any);
            if (!result) {
                return res.status(400).send();
            }

            res.locals.documentDetails = result;
            res.locals.operationType = "CREATE";

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename="${title}.pdf"`);
            res.status(200).send(pdfBuffer);
        } catch (error) {
            res.status(500).send("Error creating PDF");
        }
    }



}