import { Collection } from "mongodb";
import HistoryDal from "./history-dal";
import { GetHistoryOptions } from "./model";
import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

export default class HistoryService {
    
    
    constructor(private historyDal: HistoryDal) { }
        
 

     
      async toInsert(documentsHistory: History): Promise<History> {
          
                 await this.historyDal.insert(documentsHistory);
                 return documentsHistory;
        }

        
            async getHistory(options: GetHistoryOptions) : Promise<Array<History>>{
        
              return (await (this.historyDal.getHistory(options))).toArray();
        
        }
         async clearHistory(): Promise<void> {
    await this.historyDal.clearHistory();
  }
         
       
    }     
           
    
