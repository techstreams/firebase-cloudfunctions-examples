# Authorized Static

This example demonstrates an **HTTP Trigger [Cloud Function for Firebase](https://firebase.google.com/docs/functions/)** providing simple authenticated access to static plain-text content.  

Example uses the [Express](https://expressjs.com/) framework.

## Code

See file [functions/index.js](functions/index.js) for the code.

The dependencies are listed in [functions/package.json](functions/package.json).

## Setup

1. Clone or download this repo and open the `authorized-static` directory.
1. If you don't already have one, create a Firebase Project using the [Firebase Console](https://console.firebase.google.com).
1. If Firebase CLI is not install, install it with `npm install -g firebase-tools` and then configure it with `firebase login`.
1. Configure the CLI locally by using `firebase use --add` and select your project in the list.
1. Install dependencies locally by running: `cd functions; npm install; cd -`
1. Set the `static.token` Google Cloud environment variables to an authorization token you define (e.g. UUID string, etc.).
```bash
firebase functions:config:set static.token="A_TOKEN_YOU_DEFINE"
```

## Deploy

1. Deploy your project using `firebase deploy --only functions`.
1. Request  static content.

**IMPORTANT:**  Remember to set the `Authorization` header to `Bearer <THE_TOKEN_YOU_DEFINED>` when making the request!

Example Requests:

```
https://<YOUR_FIREBASE_CLOUD_FUNCTIONS_REQUEST_URL>/authorizedStatic/static/example-yaml.yml
https://<YOUR_FIREBASE_CLOUD_FUNCTIONS_REQUEST_URL>/authorizedStatic/static/example-markdown.md
https://<YOUR_FIREBASE_CLOUD_FUNCTIONS_REQUEST_URL>/authorizedStatic/static/example-json.json
```

*Use a URL request tool such as [curl](https://curl.haxx.se/) or [Postman](https://www.getpostman.com/) to test requests.*


 ## License

 © [Laura Taylor](https://github.com/techstreams). Licensed under an [MIT](../LICENSE) license.
