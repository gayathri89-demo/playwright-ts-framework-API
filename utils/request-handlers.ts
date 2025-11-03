import { APIRequestContext } from "@playwright/test"
import { expect } from '@playwright/test';
import { APILogger } from "./logger";

export class RequestHandler {

    private request : APIRequestContext
    private logger: APILogger
    private baseUrl?: string;
    private defaultBaseUrl?: string;
    private apiPath: string = ''
    private queryParams: Record<string, unknown> = {}
    private apiHeaders: Record<string, string> = {}
    private apiBody: object = {}


    constructor(request : APIRequestContext , apiBaseUrl? : string , logger:APILogger){
       this.request = request
       this.defaultBaseUrl = apiBaseUrl 
       this.logger = logger
       
    }

    url(url : string){ 
     this.baseUrl = url
     return this
    }

    path(path : string){ 
        this.apiPath = path
        return this
    }       

    params(path : object){
        this.queryParams = path as Record<string, unknown>
        return this
    }

    headers(headers : object){  
        this.apiHeaders = headers as Record<string, string>
        return this
    }

    body(body : object){
        this.apiBody = body
        return this
    }


   async getRequest(statusCode : number){
        const url = this.getURL()
        this.logger.logRequest('GET', url, this.apiHeaders, this.apiBody)
        const response = await this.request.get(url, {
            headers : this.apiHeaders
        })

        const actualStatus = response.status()
        const responseJSON= await response.json()
       
        this.logger.logResponse(actualStatus, responseJSON)
        expect(actualStatus).toEqual(statusCode)

        return  responseJSON
       
     //   this.statusCodeValidator(actualStatus,statusCode,this.getRequest)
     //this.statusCodeValidator(statusCode, actualStatus, this.getRequest)
       // expect(actualStatus).toEqual(statusCode)
        // const ResponseJSON = await this.request.get(url, {
        //     headers : this.apiHeaders
        // })
        
    }

    
   
   private getURL(){
        const url = new URL(`${this.baseUrl ?? this.defaultBaseUrl}${this.apiPath}`);
        for(const [key, value] of Object.entries(this.queryParams)){
            url.searchParams.append(key, String(value));
        }
        return url.toString();
    }
   
    private statusCodeValidator(actualStatusCode: number,expectedStatusCode: number){
        if(actualStatusCode !== expectedStatusCode){
            const logs = this.logger.getRecentLogs();
            const error = new Error(`Expected status code ${expectedStatusCode} but got ${actualStatusCode}.\nRecent API activity:\n${logs.join('\n')}`);
            //(Error as any).captureStackTrace(error, this.statusCodeValidator)

            throw error;
        }
    }
}