import { test as base} from '@playwright/test';
import { RequestHandler } from '../utils/request-handlers';
import { APILogger } from './logger';

export type testOptions = {
    api : RequestHandler
}

export const test = base.extend<testOptions>({
  api : async ({request}, use) => {       
    const baseUrl = 'https://conduit-api.bondaracademy.com/api'
    const logger = new APILogger()
    const requestHandler = new RequestHandler(request, baseUrl, logger)
    await use(requestHandler)
    
  }
});