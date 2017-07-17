# Text Storage

This example demonstrates an [HTTP Trigger Function](https://firebase.google.com/docs/functions/http-events) providing a simple *authorized* [REST API](https://en.wikipedia.org/wiki/Representational_state_transfer) to save and retrieve text files from [Firebase Cloud Storage](https://firebase.google.com/docs/storage/).  Client applications pass a matching authorization token pre-defined in the [Firebase Realtime Database](https://firebase.google.com/products/database/).

Example uses the [Express](https://expressjs.com/) framework and [Firebase Cloud Storage](https://firebase.google.com/docs/storage/).

## Code

See file [functions/index.js](functions/index.js) for the code.

The dependencies are listed in [functions/package.json](functions/package.json).

## Setup

1. Clone or download this repo and open the `text-storage` directory.
1. If you don't already have one, create a Firebase Project using the [Firebase Console](https://console.firebase.google.com).
1. If the Firebase CLI is not install, install it with `npm install -g firebase-tools` and then configure it with `firebase login`.
1. Configure the CLI locally by using `firebase use --add` and select your project in the list.
1. Install dependencies locally by running: `cd functions; npm install; cd -`
1. Create an authorization token in the [Firebase Realtime Database](https://firebase.google.com/products/database/) with the name `function-token`
```
<database root>
    |
    function-token: "SOME_RANDOM_TOKEN_VALUE_YOU_DEFINE"
```


**IMPORTANT:**  

* Set the request `Authorization` header to `Bearer <THE_TOKEN_DEFINED_IN_FIREBASE_DATABASE>` when making all API calls

* Set the request `Content-Type` header to `text/plain`, `text/html` ... when making **Save/(POST)** API calls

* Example assumes all files are stored/retrieved from folders *one level below* the default [Firebase Cloud Storage Bucket](https://firebase.google.com/docs/storage/).  Be sure to include a storage folder path when making API requests, e.g. `https://<YOUR_FIREBASE_CLOUD_FUNCTIONS_REQUEST_URL>/textStorage/<FOLDER>/somefile.txt`

```
<default-storage-bucket>
    SOME_FOLDER/
        SOME_FILE.txt
    ANOTHER_FOLDER/
        ANOTHER_FILE.md
```


* (Optional) Example assumes the [Firebase Cloud Storage Rules](https://firebase.google.com/docs/storage/security/) are set to the following so only the function can read/write to storage:

```
{
  "rules": {
    ".read": false,
    ".write": false
  }
}
```


## Deploy

Deploy project using `firebase deploy --only functions`


## Request from Google Apps Script

Example Google Apps Script to call the deployed Cloud Function to **save a text file** to [Firebase Cloud Storage](https://firebase.google.com/docs/storage/).


```js

...

function saveTextToStorage() {

   var response, responseCode;

   // DEVELOPER TODO:  Replace "functionUrl" with the deployed Cloud Function URL from the Firebase Console
   // Consider storing URL in a Google Apps Script Properties Store ... PropertiesService.getScriptProperties().getProperty('functionUrl')
   var functionUrl = "https://<FIREBASE_CLOUD_FUNCTION_URL>/textStorage";

   // DEVELOPER TODO:  Replace <TOKEN> with user defined token stored in Firebase Realtime Database
   // Consider storing token in a Google Apps Script Properties Store ... PropertiesService.getScriptProperties().getProperty('functionToken')
   var functionToken = "<TOKEN>";

   // DEVELOPER TODO: Replace <FOLDER> with name of the parent folder of the file to be stored in Cloud Storage Bucket e.g. "myfolder"
   var filePath = "<FOLDER>";

   // DEVELOPER TODO: Replace <FILENAME> with the name of the file to be stored in Cloud Storage Bucket e.g. "mydoc.txt"
   var fileName = "<FILENAME>";

   // DEVELOPER TODO: Replace "content" with text content of file to be stored in Cloud Storage Bucket
   var fileContent = "... file content ...";

   var params = {
     'method': 'POST',
     'contentType': 'text/plain',
     'headers': {
         'Authorization': 'Bearer ' + functionToken
      },
     'payload' : fileContent
   };

   response = UrlFetchApp.fetch(functionUrl + "/" + filePath + "/" + fileName, params);
   responseCode = response.getResponseCode();

   if (responseCode == 200) {
      // Success fetching file
      return true;
   } else {
      // Error returned from Cloud Function
      Logger.log('Error saving file.  Response code: ' + responseCode);
      return false;
   }

}

...

```

<br>


Example Google Apps Script to call the deployed Cloud Function to **retrieve an existing text file** from [Firebase Cloud Storage](https://firebase.google.com/docs/storage/).

```js

...

function getTextFromStorage() {

   var response, responseCode;

   // DEVELOPER TODO:  Replace with deployed Cloud Function URL
   // Consider storing URL in a Google Apps Script Properties Store
   var functionUrl = "https://<FIREBASE_CLOUD_FUNCTION_URL>/textStorage/";

   // DEVELOPER TODO:  Replace <TOKEN> with pre-defined token stored in Firebase Realtime Database
   // Consider storing token in Google Apps Script Properties Store
   var functionToken = "<TOKEN>";

   // DEVELOPER TODO: Replace <FOLDER> and <FILENAME> with path and name of file stored in Cloud Storage Bucket e.g. "myfiles/mydoc.txt"
   var filePath = "<FOLDER>/<FILENAME>";

   var params = {
     'method': 'GET',
     'headers': {
         'Authorization': 'Bearer ' + functionToken
      }
   };

   response = UrlFetchApp.fetch(functionUrl + filePath, params);
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
