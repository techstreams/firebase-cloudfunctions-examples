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

// Configuration - YAML Parser
const jsyaml = require('js-yaml')
let action;

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
  const validActions = ['DUMP', 'LOAD']
  action = req.body.action ? req.body.action.toUpperCase() : null
  if (!req.is('application/json')) {
    res.status(400).send('Invalid Content-Type')
    return
  } else if (!req.body.content) {
    res.status(400).send('No Content')
    return
  } else if (!action || validActions.indexOf(action) === -1) {
    res.status(400).send('Invalid Action')
    return
  } else {
    next()
  }
}

// Return supported options
const getParserOptions = (action, options) => {
  if (action === 'LOAD') {
    // "LOAD" option supported in this Cloud Function - see options https://github.com/nodeca/js-yaml#safeload-string---options-
    console.log('Value = ' + options.json)
    return {
      json: options.json ? options.json : false
    }
  } else {
    // "DUMP" options supported in this Cloud Function - see options https://github.com/nodeca/js-yaml#safedump-object---options-
    // Option key must match camelcase Yaml Parser option name
    return {
      indent: options.indent ? options.indent : 2,
      flowLevel: options.flowLevel ? options.flowLevel : -1,
      sortKeys: options.sortKeys ? options.sortKeys : false,
      lineWidth: options.lineWidth ? options.lineWidth : 80,
      noRefs: options.noRefs ? options.noRefs : false,
      noCompatMode: options.noCompatMode ? options.noCompatMode : false
    }
  }
}

// Use Middleware
app.use(allowMethods)
app.use(requiredFields)


// Handle Post Request
app.post('/', (req, res) => {
  try {
    const options = req.body.options ? getParserOptions(action, req.body.options) : null
    if (action === 'LOAD') {
      options ? res.status(200).send(jsyaml.safeLoad(req.body.content, options)) : res.status(200).send(jsyaml.safeLoad(req.body.content))
    } else if (action === 'DUMP') {
      options ? res.status(200).send(jsyaml.safeDump(req.body.content, options)) : res.status(200).send(jsyaml.safeDump(req.body.content))
    } else {
      throw new Error('Invalid Action')
    }
  } catch(err) {
    res.status(500).send(`Error trying to ${action} Yaml: ${err.message}`)
  }

})

// Send a 400 for non-matching post requests
app.post('*', (req, res) => {
  res.status(400).send('Bad Request')
})

// Export Function
exports.yamlParser = functions.https.onRequest(app)
