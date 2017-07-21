# Yaml Parser

This example demonstrates an [HTTP Trigger Function](https://firebase.google.com/docs/functions/http-events) providing [YAML](https://en.wikipedia.org/wiki/YAML) parsing with [js-yaml](https://github.com/nodeca/js-yaml).  Default *[safeLoad](https://github.com/nodeca/js-yaml#safeload-string---options-)* and *[safeDump](https://github.com/nodeca/js-yaml#safedump-object---options-)* actions are supported *along with restricted options*.

Example uses the [Express](https://expressjs.com/) framework.

## Code

See file [functions/index.js](functions/index.js) for the code.

The dependencies are listed in [functions/package.json](functions/package.json).

## Setup

1. Clone or download this repo and open the `yaml-parser` directory.
1. If you don't already have one, create a Firebase Project using the [Firebase Console](https://console.firebase.google.com).
1. If the Firebase CLI is not install, install it with `npm install -g firebase-tools` and then configure it with `firebase login`.
1. Configure the CLI locally by using `firebase use --add` and select your project in the list.
1. Install dependencies locally by running: `cd functions; npm install; cd -`

**IMPORTANT:**  

Cloud Function only supports **POST** requests.

Requests to Cloud Function should specify header `contentType` of `application/json` and contain the following fields:

* **content** - YAML content (for LOAD) /  JSON content (for DUMP)
* **action** - action to be performed by Cloud Function (possible values: "LOAD" or "DUMP")
* (optional) **options**
  * **[safeLoad](https://github.com/nodeca/js-yaml#safeload-string---options-)** - only `json` option supported
  * **[safeDump](https://github.com/nodeca/js-yaml#safedump-object---options-)** -  all options supported **EXCEPT** `skipInvalid`, `styles`, `schema` and `condenseFlow`


Example LOAD Request (from YAML):

```
{
  "content": "cats:\n- rats\n- mats\n- hats",
  "action": "LOAD"
}
```

Example LOAD Response (to JSON):

```
{
  "cats": [
    "rats",
    "mats",
    "hats"
  ]
}
```

Example DUMP Request (from JSON):

```
{
	"content":{
	  "cats":["rats", "mats", "hats"]
	},
	"action":"dump",
	"options": {
	  "indent": 4
	}
}
```

Example DUMP Response (to YAML):

```
cats:
    - rats
    - mats
    - hats
```



## Deploy

Deploy project using `firebase deploy --only functions`


## Request from Google Apps Script

Example Google Apps Script to call the deployed Cloud Function to **LOAD YAML and return as JSON**.


```js

...

function loadYaml() {

  var response, responseCode;

  // DEVELOPER TODO:  Replace "functionUrl" with the deployed Cloud Function URL from the Firebase Console
  // Consider storing URL in a Google Apps Script Properties Store
  var functionUrl = "https://<FIREBASE_CLOUD_FUNCTION_URL>/yamlParser";

  // DEVELOPER TODO: Replace "content" with YAML content to be LOADed to JSON
  var yaml = "cats:\n- rats\n- mats\n- hats";

  var requestBody = {
     content: yaml,
     action: "LOAD"
  };

  var params = {
     'method': 'POST',
     'contentType': 'application/json',
     'payload' : JSON.stringify(requestBody)
  };

  response = UrlFetchApp.fetch(functionUrl + "/", params);
  responseCode = response.getResponseCode();

  if (responseCode == 200) {
      // Success fetching file from Cloud Function
      return JSON.parse(response.getContentText());
  } else {
      // Error returned from Cloud Function
      Logger.log('Error loading YAML.  Response code: ' + responseCode);
      return null;
  }

}

...

```

<br>


Example Google Apps Script to call the deployed Cloud Function to **DUMP JSON and return as YAML**.

```js

...

function dumpYaml() {

   var response, responseCode;

   // DEVELOPER TODO:  Replace "functionUrl" with the deployed Cloud Function URL from the Firebase Console
   // Consider storing URL in a Google Apps Script Properties Store
   var functionUrl = "https://<FIREBASE_CLOUD_FUNCTION_URL>/yamlParser";

   // DEVELOPER TODO: Replace "content" with JSON content to be DUMPed to YAML
   var json = { cats: ["rats", "mats","hats"] };

  var requestBody = {
     content: json,
     action: "DUMP",
     options: {
       indent: 4
     }
  };

   var params = {
     'method': 'POST',
     'contentType': 'application/json',
     'payload' : JSON.stringify(requestBody)
   };

   response = UrlFetchApp.fetch(functionUrl + "/", params);
   responseCode = response.getResponseCode();

   if (responseCode == 200) {
      // Success fetching file from Cloud Function
      return response.getContentText();
   } else {
      // Error returned from Cloud Function
      Logger.log('Error dumping YAML.  Response code: ' + responseCode);
      return null;
   }

}

...

```



 ## License

 © [Laura Taylor](https://github.com/techstreams). Licensed under an [MIT](../LICENSE) license.
