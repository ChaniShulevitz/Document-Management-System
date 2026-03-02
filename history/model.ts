export enum OperationType {
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "STUDENT"
}


export interface History {

    user?: string;
    documentId: string;
    doucumentpath: string;
    documentAuthor:string,
    timeStamp: string;
    operationType: OperationType;
    
  
    
}

export interface GetHistoryOptions {
  pathPrefix?: string;
  user?: string;
  documentId?: string;
  documentAuthor?: string;
  operationType?: OperationType;

  page?: number;
  limit?: number;
}