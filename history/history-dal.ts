import { Collection } from "mongodb";
import DbConn from "../utils/db-conn";
import { GetHistoryOptions } from "./model";

const HISTORY_COLLECTION_NAME = "history";


export default class HistoryDal {

    private historyCollection: Collection<History>;

    constructor(dbConn: DbConn) {

        this.historyCollection = dbConn.getCompanyDB().collection(HISTORY_COLLECTION_NAME);
    }


     async insert(documentsHistory: History): Promise<Collection<History>> {
        const exsits= await this.historyCollection.insertOne(documentsHistory);
        return this.historyCollection;
    }

    async getHistory(options: GetHistoryOptions) {
        const { pathPrefix, user, documentId, documentAuthor, operationType,  page = 1,
    limit = 5, } = options;

        const filter: any = {};
        if (pathPrefix) {
            filter.path = { $regex: `^${pathPrefix}` };
        }

        if (options.user) {
            filter.user = options.user;
        }

        if (options.documentId) {
            filter.documentId = options.documentId;
        }

        if (options.documentAuthor) {
            filter.documentAuthor = options.documentAuthor;
        }

        if (options.operationType) {
            filter.operationType = options.operationType;
        }

        return this.historyCollection
    .find(filter)
    .sort({ timestamp: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
    }

    
  async clearHistory(): Promise<void> {
    await this.historyCollection.deleteMany({});

}

}


