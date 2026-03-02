import { MyDocument } from "../documents/models";


declare global {
    namespace Express {
        interface Request {
            userId?: string;
            document?: MyDocument;
        }
    }
}

export {};