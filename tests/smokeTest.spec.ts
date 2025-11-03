import { test } from '../utils/fixtures';
import { expect } from '@playwright/test';
import { APILogger } from '../utils/logger';

let authToken: string 

test('logger',()=> {
    const logger = new APILogger()
    const logger2 =new APILogger()
    logger.logRequest('POST','https://example.com/api/test',{Authorization : 'token'},{foo:'bar'})
    logger.logResponse(200,{foo:'bar'})
    logger2.logRequest('GET','https://example.com/api/test2',{Authorization : 'token'},{foo:'bar'})
    logger2.logResponse(200,{foo:'bar'})
    const logs = logger.getRecentLogs()
    const logs2 = logger2.getRecentLogs()
    console.log(logs)
    console.log(logs2)
})

test('Get articles', async ({api}) => { 
  const response = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)
    expect(response.articles.length).toBeLessThanOrEqual(10);
})  

test('Get Test tags', async ({api}) => { 
const response = await api
    .path('/tags')
    .getRequest(200)
    expect(response.tags[0]).toEqual('Test')
    expect(response.tags.length).toBeLessThanOrEqual(10);
})

