# Markdown

This example demonstrates an [HTTP Trigger Function](https://firebase.google.com/docs/functions/http-events) providing [markdown](https://en.wikipedia.org/wiki/Markdown) parsing with [marked](https://github.com/chjj/marked).  Default *[render](https://github.com/chjj/marked#usage)* and *[lex](https://github.com/chjj/marked#pro-level)* actions are supported, along with [highlight.js](https://highlightjs.org/) code highlighting.

Example uses the [Express](https://expressjs.com/) framework.

## Code

See file [functions/index.js](functions/index.js) for the code.

The dependencies are listed in [functions/package.json](functions/package.json).

## Setup

1. Clone or download this repo and open the `markdown` directory.
1. If you don't already have one, create a Firebase Project using the [Firebase Console](https://console.firebase.google.com).
1. If the Firebase CLI is not install, install it with `npm install -g firebase-tools` and then configure it with `firebase login`.
1. Configure the CLI locally by using `firebase use --add` and select your project in the list.
1. Install dependencies locally by running: `cd functions; npm install; cd -`

**IMPORTANT:**  

Cloud Function only supports **POST** requests.

Requests to Cloud Function should specify header `contentType` of `application/json` and contain the following fields:

* **content** - markdown content
* **action** - action to be performed by Cloud Function (possible values: "RENDER" or "LEX")
* (optional) **options** - [marked](https://github.com/chjj/marked) parser options - *see [marked options](https://github.com/chjj/marked#options-1) for more information*
  * All [marked options](https://github.com/chjj/marked#options-1) are supported **EXCEPT** `renderer`  
  * To highlight code, send `highlight: true` option instead of a highlight function
  * Cloud Function uses [highlight.js](https://highlightjs.org/) for all code highlighting

Example Request:

```
{
  "content": "# Hello World",
  "action": "RENDER",
  "options": {
     "highlight": true,
     "gfm": false
  }
}
```


## Deploy

1. Deploy your project using `firebase deploy --only functions`.


## Request from Google Apps Script


Example Google Apps Script to call deployed Cloud Function for markdown *[render](https://github.com/chjj/marked#usage)* action.

```js

...

function getRenderedMarkdown() {

   var response, responseCode;

   // DEVELOPER TODO:  Replace "functionUrl" with the deployed Cloud Function URL from the Firebase Console
   // Consider storing URL in a Google Apps Script Properties Store
   var functionUrl = "https://<FIREBASE_CLOUD_FUNCTION_URL>/markdown";

   // DEVELOPER TODO: Replace markdown content
   var markdown = "# Example Code\n\n```js\n console.log('hello'); \n```";

   var requestBody = {
      content: markdown,
      action: "RENDER",
      options: {
         highlight: true
      }
   }

   var params = {
     "method": "POST",
     "contentType": "application/json",
     "payload": JSON.stringify(requestBody)
   };

   response = UrlFetchApp.fetch(functionUrl + "/", params);
   responseCode = response.getResponseCode();

   if (responseCode == 200) {
      // Success fetching file from Cloud Function
      return response.getContentText();
   } else {
      // Error returned from Cloud Function
      return null;
   }

}

...

```

<br>

Example Google Apps Script to call deployed Cloud Function for markdown *[lex](https://github.com/chjj/marked#pro-level)* action.

```js

...

function getLexedTokens() {

   var response, responseCode;

   // DEVELOPER TODO:  Replace "functionUrl" with the deployed Cloud Function URL from the Firebase Console
   // Consider storing URL in a Google Apps Script Properties Store
   var functionUrl = "https://<FIREBASE_CLOUD_FUNCTION_URL>/markdown";

   // DEVELOPER TODO: Replace markdown content
   var markdown = "# Example Code\n\n```js\n console.log('hello'); \n```";

   var payload = {
      content: markdown,
      action: "LEX"
   }

   var params = {
     "method": "POST",
     "contentType": "application/json",
     "payload": JSON.stringify(payload)
   };

   response = UrlFetchApp.fetch(functionUrl + "/", params);
   responseCode = response.getResponseCode();

   if (responseCode == 200) {
      // Success fetching file from Cloud Function
      return response.getContentText();
   } else {
      // Error returned from Cloud Function
      return null;
   }

}

...

```


 ## License

 © [Laura Taylor](https://github.com/techstreams). Licensed under an [MIT](../LICENSE) license.
