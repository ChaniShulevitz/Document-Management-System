import { Collection } from "mongodb";


import DbConn from "../utils/db-conn";
import { DocumentDetails, GetDocumentsOptions, MyDocument, MyDocumentWithId } from "./models";

const DOCUMENTS_COLLECTION_NAME = "documents";
const DOCUMENTS_DETAILS_NAME = "document_details";
export const DOCUMENT_NOT_FOUND_ERROR = "Document not found";
export const DOCUMENT_ALREADY_EXISTS = "Document already exists";

export default class DocumentsDal {
    private documentsCollection!: Collection<MyDocument>
    private documentsDetailsCollection!: Collection<DocumentDetails>
    constructor(dbConn: DbConn) {
        this.documentsCollection = dbConn.getCompanyDB().collection(DOCUMENTS_COLLECTION_NAME);
    }

    async create(document: MyDocument, documentDetails: DocumentDetails): Promise<DocumentDetails | null> {

        const exists = await this.documentsCollection.findOne({ id: (document.id) });
        if (exists) {
            throw new Error(DOCUMENT_ALREADY_EXISTS);
        }
        await this.documentsCollection.insertOne(document);
        await this.documentsDetailsCollection.insertOne(documentDetails);
        const details = await this.documentsDetailsCollection.findOne({ id: (document.id) });
        return details;
    }

    async getAll(options: GetDocumentsOptions) {
        const { pathPrefix, author, sortBy } = options;


        const filter: any = {};

        if (pathPrefix) {
            filter.path = { $regex: `^${pathPrefix}` };
        }

        if (author) {
            filter.author = author;
        }

        let query = this.documentsCollection.find(filter);

        if (sortBy) {
            const direction = sortBy.startsWith('-') ? -1 : 1;
            const field = sortBy.replace("-", "");
            query = query.sort({ [field]: direction });
        }
        return await query.toArray();
    }

    async getById(id: string): Promise<MyDocument> {
        const document = await this.documentsCollection.findOne({ id });
        if (!document) {
            throw new Error(DOCUMENT_NOT_FOUND_ERROR)
        }
        const { _id, ...doc } = document;
        return doc as MyDocument;
    }

    async update(document: MyDocument, documentDetails: DocumentDetails): Promise<DocumentDetails | null>// !res.modifiedCount
    {
        const res = await this.documentsCollection.updateOne({ id: document.id }, { $set: document });
        const res_2 = await this.documentsDetailsCollection.updateOne({ id: document.id }, { $set: documentDetails });
        if (!res.modifiedCount) {
            throw new Error(DOCUMENT_NOT_FOUND_ERROR);
        }
        const details = await this.documentsDetailsCollection.findOne({ id: document.id });
        return details;
    }

    async delete(id: string): Promise<DocumentDetails | null> {
        let res_2: DocumentDetails | null;
        const res = await this.documentsCollection.deleteOne({ id });
        res_2 = await this.documentsDetailsCollection.findOne({ id });
        const res_1 = await this.documentsDetailsCollection.deleteOne({ id });

        if (!res.deletedCount) {
            throw new Error(DOCUMENT_NOT_FOUND_ERROR);
        }
        return res_2;
    }

    async downloadFile(id: string): Promise<MyDocument | null> {
        return await this.documentsCollection.findOne({ id });
    }
}


