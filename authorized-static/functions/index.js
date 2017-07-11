/**
 * Copyright (c) 2017 Laura Taylor (https://github.com/techstreams)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use strict';

const functions = require('firebase-functions')
const express = require('express')
const app = express()

// Token validation middleware
const validateToken = (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    console.error('Unauthorized request.  No token was passed as a Bearer token in the Authorization header.')
    res.status(403).send('Unauthorized')
    return
  }
  const idToken = req.headers.authorization.split('Bearer ')[1]
  if (idToken != functions.config().static.token) {
    console.log(`Unauthorized token: ${idToken}`)
    res.status(403).send('Unauthorized')
    return
  }
  console.log('Authorized request')
  next()
};

// Use token validation middleware
app.use(validateToken)

// Serve static content
app.use('/static', express.static('public'))

// Send a 404 for non-matching requests
app.get('*', (req, res) => {
  res.status(404).send('Not Found')
})

exports.authorizedStatic = functions.https.onRequest(app)
