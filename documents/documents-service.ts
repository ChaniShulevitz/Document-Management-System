import DocumentsDal, { DOCUMENT_ALREADY_EXISTS, DOCUMENT_NOT_FOUND_ERROR } from "./documents-dal";
import { DocumentDetails, GetDocumentsOptions, MyDocument } from "./models";
import PDFDocument from 'pdfkit';
import { v4 as uuidv4 } from 'uuid';


export default class DocumentService {
    constructor(private documentsDal: DocumentsDal) { }

    async create(document: MyDocument): Promise<boolean> {
        document.id = uuidv4();
        document.createdAt = new Date();
        const documentDetails: DocumentDetails = {
            id: document.id,
            author: document.author,
            path: document.path,
            title: document.title,
        };
        try {
            await this.documentsDal.create(document, documentDetails);
            return true;
        }
        catch (err: any) {
            if (err.message === DOCUMENT_ALREADY_EXISTS) {
                return false;
            }
            throw err;
        }
    }

    async getAll(getDocumentsOptions: GetDocumentsOptions): Promise<MyDocument[]> {
        return this.documentsDal.getAll(getDocumentsOptions);
    }

    async getById(id: string): Promise<MyDocument | null> {
        let document: MyDocument | null;
        try {
            document = await this.documentsDal.getById(id);
        }
        catch (err: any) {
            if (err === DOCUMENT_NOT_FOUND_ERROR) {
                return null;
            }
            throw err;
        }
        return document;
    }
    async update(document: MyDocument): Promise<boolean> {
        document.lastUpdateBy = document.id;
        document.lastUpdatedAt = new Date();
        const documentDetails: DocumentDetails = {
            id: document.id,
            author: document.author,
            path: document.path,
            title: document.title,
        };
        try {
            await this.documentsDal.update(document, documentDetails);
            return true;
        }
        catch (err: any) {
            if (err === DOCUMENT_NOT_FOUND_ERROR) {
                return false;
            }
            throw err;
        }
    }
    async delete(id: string): Promise<boolean> {

        try {
            await this.documentsDal.delete(id);
            return true;
        }
        catch (err: any) {
            if (err === DOCUMENT_NOT_FOUND_ERROR) {
                return false;
            }
            throw err;
        }
    }

    async createPdf(title: string, content: string): Promise<Buffer> {

        return new Promise((resolve, reject) => {
            const doc = new PDFDocument();
            const buffers: Uint8Array[] = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                resolve(Buffer.concat(buffers));
            });

            doc.fontSize(20).text(title, { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(content);

            doc.end();
        });
    }

}





