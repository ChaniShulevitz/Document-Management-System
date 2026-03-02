import { Db, MongoClient } from "mongodb";


const DB_URL = "mongodb+srv://taliweiss5_db_user:<0533193618>@cluster0.csdhxvv.mongodb.net/?appName=Cluster0";
const COMPANY_DB_NAME = "company";

export default class DbConn {
    private connection!: MongoClient;

    constructor() { }

    async init() {
        this.connection = await MongoClient.connect(DB_URL);
    }

    getCompanyDB(): Db {
        return this.connection.db(COMPANY_DB_NAME);
    }

    async terminate() {
        await this.connection.close();
    }
}