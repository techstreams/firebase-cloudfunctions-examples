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

// Configuration - Cloud Functions
const fbTokenPath = '/function-token'
const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

// Configuration - Cloud Storage
const gcs = require('@google-cloud/storage')()
const bucket = gcs.bucket(functions.config().firebase.storageBucket)

// Configuration - Express
const express = require('express')
const app = express()


// Request Method Validation Middleware
const allowMethods = (req, res, next) => {
  const methods = ['GET','POST']
  if (methods.indexOf(req.method.toUpperCase()) === -1) {
    res.header('Allow', methods.join(', '))
    res.status(405).send('Request Method Not Allowed')
  }
  next()
}

// Token validation middleware
const validateToken = (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ') || !req.headers.authorization.split('Bearer ')[1]) {
    console.error('Unauthorized Request.  No Token was Passed in the Authorization Header.')
    res.status(403).send('Unauthorized')
  }
  const reqToken = req.headers.authorization.split('Bearer ')[1]
  admin.database().ref(fbTokenPath).once('value').then(snapshot => {
    const fbToken = snapshot.val()
    if (!fbToken) {
      console.log('No Function Token Found in Firebase')
      res.status(403).send('Unauthorized')
    }
    if (reqToken != fbToken) {
      console.log(`Unauthorized Token: ${reqToken}`)
      res.status(403).send('Unauthorized')
    }
    next()
  }).catch(error => {
    console.log(`Authorization Error: ${error}`)
    res.status(403).send('Unauthorized');
  })
}

// Use Middleware
app.use(allowMethods)
app.use(validateToken)


// Handle Get Request
app.get('/:path/:filename', (req, res) => {
  const file = bucket.file(req.params.path + '/' + req.params.filename)
  file.exists().then(data => {
    if (!data[0]) {
      res.status(404).send('Not Found')
    }
    return file.download()
  }).then(content => {
    res.status(200).send(content[0])
  }).catch(err => {
    console.log(`Error Retrieving File: ${err}`)
    res.status(500).send('Server Error')
  })
})


// Handle Post Request
app.post('/:path/:filename', (req, res) => {
  // Ensure Content and Content-Type matches 'text/*'
  if (req.body && req.body != '' && req.is('text/*')) {
    const file = bucket.file(req.params.path + '/' + req.params.filename)
    const options = {
      metadata: {
        contentType: req.get('content-type')
      }
    }
    file.save(req.body, options).then(() => {
      res.status(200).send('File Saved')
    }).catch(err => {
      console.log(`Error Saving File to Storage: ${err}`)
      res.status(500).send('Server Error')
    })
  } else {
    console.log('No File Content or Wrong Content-Type')
    res.status(400).send('Bad Request')
  }
})

// Send a 400 for non-matching get requests
app.get('*', (req, res) => {
  res.status(400).send('Bad Request')
})

// Send a 400 for non-matching post requests
app.post('*', (req, res) => {
  res.status(400).send('Bad Request')
})

// Export Function
exports.textStorage = functions.https.onRequest(app)
