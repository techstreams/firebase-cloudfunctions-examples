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
const functions = require('firebase-functions')

// Configuration - Express
const express = require('express')
const app = express()

// Configuration - Markdown Parser
const marked = require('marked')
const highlightjs = require('highlight.js')

// Request Method Validation Middleware
const allowMethods = (req, res, next) => {
  const methods = ['POST']
  if (methods.indexOf(req.method.toUpperCase()) === -1) {
    res.header('Allow', methods.join(', '))
    res.status(405).send('Request Method Not Allowed')
    return
  }
  next()
}

// Required Fields Middleware
const requiredFields = (req, res, next) => {
  const validActions = ['RENDER', 'LEX']
  if (!req.is('application/json')) {
    res.status(400).send('Invalid Content-Type')
    return
  } else if (!req.body.content) {
    res.status(400).send('No Content')
    return
  } else if (!req.body.action || validActions.indexOf(req.body.action.toUpperCase()) === -1) {
    res.status(400).send('Invalid Action')
    return
  } else {
    next()
  }
}

// Set marked parser options
const setMarkedOptions = (options) => {
  const highlighter = (code) => { return highlightjs.highlightAuto(code).value }
  marked.setOptions({
    gfm: options.gfm ? options.gfm : true,
    tables: options.tables ? options.tables : true,
    breaks: options.breaks ? options.breaks : false,
    pedantic: options.pedantic ? options.pedantic : false,
    sanitize: options.sanitize ? options.sanitize : false,
    smartLists: options.smartLists ? options.smartLists : true,
    smartypants: options.smartypants ? options.smartypants : false,
    highlight: options.highlight ? highlighter : null
  })
}

// Use Middleware
app.use(allowMethods)
app.use(requiredFields)


// Handle Post Request
app.post('/', (req, res) => {
  try {
    if (req.body.options) {
      setMarkedOptions(req.body.options)
    }
    if (req.body.action.toUpperCase() === 'RENDER') {
      res.status(200).send(marked(req.body.content))
    } else if (req.body.action.toUpperCase() === 'LEX') {
      res.status(200).send(marked.lexer(req.body.content))
    } else {
      throw new Error('Invalid Action')
    }
  } catch(err) {
    res.status(500).send(`Error Rendering Markdown: ${err.message}`)
  }

})

// Send a 400 for non-matching post requests
app.post('*', (req, res) => {
  res.status(400).send('Bad Request')
})

// Export Function
exports.markdown = functions.https.onRequest(app)
