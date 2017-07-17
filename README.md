# Overview

This repository contains a *growing* collection of [Firebase Cloud Function](https://firebase.google.com/features/functions) examples to demonstrate backend support for [Google Apps Script](https://www.google.com/script/start/).

*Testing [HTTP Trigger Functions](https://firebase.google.com/docs/functions/http-events)?  Try [Postman](https://www.getpostman.com/).*

## Examples

### [HTTP trigger: authorizedStatic](/authorized-static)

This example demonstrates an [HTTP Trigger Function](https://firebase.google.com/docs/functions/http-events) serving *authorized* content from a `static` path.  Client applications pass a matching authorization token pre-defined in the [function configuration](https://firebase.google.com/docs/functions/config-env) - `functions.config()`.  

Example uses the [Express](https://expressjs.com/) framework.


### [HTTP trigger: textStorage](/text-storage)

This example demonstrates an [HTTP Trigger Function](https://firebase.google.com/docs/functions/http-events) providing a simple *authorized* [REST API](https://en.wikipedia.org/wiki/Representational_state_transfer) to save and retrieve text files from [Firebase Cloud Storage](https://firebase.google.com/docs/storage/).  Client applications pass a matching authorization token pre-defined in the [Firebase Realtime Database](https://firebase.google.com/products/database/).

Example uses the [Express](https://expressjs.com/) framework and [Firebase Cloud Storage](https://firebase.google.com/docs/storage/).


### [HTTP trigger: markdown](/markdown)

This example demonstrates an [HTTP Trigger Function](https://firebase.google.com/docs/functions/http-events) providing [markdown](https://en.wikipedia.org/wiki/Markdown) parsing with [marked](https://github.com/chjj/marked).  Default *[render](https://github.com/chjj/marked#usage)* and *[lex](https://github.com/chjj/marked#pro-level)* actions are supported, along with [highlight.js](https://highlightjs.org/) code highlighting.

Example uses the [Express](https://expressjs.com/) framework.

## License

© [Laura Taylor](https://github.com/techstreams). Licensed under an [MIT](LICENSE) license.
