import { ObjectId } from "mongodb";
import { v4 as uuidv4 } from 'uuid';




export interface MyDocumentWithId extends Document {
    _id?: ObjectId;
}


export interface MyDocument {
    id: string;
    author: string;
    path: string;
    title: string;
    content: string;
    createdAt: Date;
    lastUpdatedAt: Date;
    lastUpdateBy: string;
}

export interface DocumentDetailsWithId extends DocumentDetails {
    _id?: ObjectId;
}


export interface DocumentDetails {
    id: string;
    author: string;
    path: string;
    title: string;
}

export interface GetDocumentsOptions {
    pathPrefix?: string;
    author?: string;
    sortBy?: string;
}