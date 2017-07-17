# Authorized Static

This example demonstrates an [HTTP Trigger Function](https://firebase.google.com/docs/functions/http-events) serving *authorized* content from a `static` path.  Client applications pass a matching authorization token pre-defined in the [function configuration](https://firebase.google.com/docs/functions/config-env) - `functions.config()`.  

Example uses the [Express](https://expressjs.com/) framework.

## Code

See file [functions/index.js](functions/index.js) for the code.

The dependencies are listed in [functions/package.json](functions/package.json).

## Setup

1. Clone or download this repo and open the `authorized-static` directory.
1. If you don't already have one, create a Firebase Project using the [Firebase Console](https://console.firebase.google.com).
1. If the Firebase CLI is not install, install it with `npm install -g firebase-tools` and then configure it with `firebase login`.
1. Configure the CLI locally by using `firebase use --add` and select your project in the list.
1. Install dependencies locally by running: `cd functions; npm install; cd -`
1. Set the `static.token` [function environment variable](https://firebase.google.com/docs/functions/config-env) to an authorization token you define (e.g. UUID string, etc.).
```bash
firebase functions:config:set static.token="A_TOKEN_YOU_DEFINE"
```

**IMPORTANT:**  Remember to set the `Authorization` header to `Bearer <THE_TOKEN_YOU_DEFINED>` when making the request!


## Deploy

1. Deploy your project using `firebase deploy --only functions`.


## Request from Google Apps Script


Example Google Apps Script to request a static file from the deployed Cloud Function.

```js

...

function getStatic() {

   var response, responseCode;

   // DEVELOPER TODO:  Replace "functionUrl" with the deployed Cloud Function URL from the Firebase Console
   // Consider storing URL in a Google Apps Script Properties Store
   var functionUrl = "https://<FIREBASE_CLOUD_FUNCTION_URL>/authorizedStatic";

   // DEVELOPER TODO:  Replace <TOKEN> with pre-defined token defined in the Cloud Function configuration
   // Consider storing token in a Google Apps Script Properties Store
   var functionToken = "<TOKEN>";

   var filePath = "static";

   // DEVELOPER TODO: Replace <FILENAME> with name of file to retrieve from Cloud Function e.g. "myconfig.yml"
   var fileName = "<FILENAME>";

   var params = {
     'method': 'GET',
     'headers': {
         'Authorization': 'Bearer ' + functionToken
      }
   };

   response = UrlFetchApp.fetch(functionUrl + "/" + filePath + "/" + fileName, params);
   responseCode = response.getResponseCode();

   if (responseCode == 200) {
      // Success fetching file from Cloud Function
      return response.getContentText();
   } else {
      // Error returned from Cloud Function
      Logger.log('Error fetching file.  Response code: ' + responseCode);
      return null;
   }

}

...

```


 ## License

 © [Laura Taylor](https://github.com/techstreams). Licensed under an [MIT](../LICENSE) license.
