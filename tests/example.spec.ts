import { test, expect } from '@playwright/test';

let authToken : string;

test.beforeAll('run before all tests', async ({request}) => {
  console.log('Starting API tests...');
    const tokenResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: {"user":{"email": "gayathri.r.nair89@gmail.com", "password": "Shrihari2016@"}}
  })

    // Login to get auth token

const tokenResponseJSON = await tokenResponse.json();
authToken = 'Token ' + tokenResponseJSON.user.token; // Removed const
console.log(authToken);
});

test.afterAll('run after all tests', async () => {
console.log('API tests completed.');
}); 

test('Get test tags', async ({ request }) => {
  const tagsResponse = await request.get('https://conduit-api.bondaracademy.com/api/tags')
  const tagsResponseJSON = await tagsResponse.json();
  console.log(await tagsResponse.json());

  expect(tagsResponse.status()).toEqual(200);
  expect(tagsResponseJSON.tags.length).toBeLessThanOrEqual(10);
  console.log(tagsResponse.status());
});

test('Get all articles', async ({ request }) => {
  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0');
  const articlesResponseJSON = await articlesResponse.json();
  console.log(await articlesResponse.json());

  expect(articlesResponse.status()).toEqual(200);
  expect(articlesResponseJSON.articles.length).toBeLessThanOrEqual(10);
  console.log(articlesResponse.status());

});

test('Create and Delete Article', async ({ request }) => {

// Generate unique title using timestamp
  const uniqueTitle = `Test Article ${Date.now()}`;

// Create new article
  const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles', {
    data: {
      "article": {
        "title": uniqueTitle,
        "description": "Article created via API testing",
        "body": "This is the body of the article created using Playwright API testing.",
        "tagList": ["API"]
      }
    },
    headers: {
      'Authorization': authToken
    }
  });
  const newArticleResponseJSON = await newArticleResponse.json();
  
  // Assertions
  expect(newArticleResponse.status()).toEqual(201);
  expect(newArticleResponseJSON.article.title).toEqual(uniqueTitle);
  expect(newArticleResponseJSON.article.description).toEqual("Article created via API testing");
  expect(newArticleResponseJSON.article.tagList).toEqual(["API"]);
  //console.log(newArticleResponseJSON);

// Delete the created article
  const slug = newArticleResponseJSON.article.slug;
  const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slug}`, {
    headers: {
      'Authorization': authToken
    }
  });

  // Assertion for delete
  expect(deleteArticleResponse.status()).toEqual(204);
})



