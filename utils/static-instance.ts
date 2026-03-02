import HistoryDal from "../history/history-dal";
import HistoryService from "../history/history-service";
import DbConn from "./db-conn";


const dbConn= new DbConn()
const historyDal = new HistoryDal(dbConn);
const historyService = new HistoryService(historyDal);

export default historyService;
