/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


/* Amplify Params - DO NOT EDIT
	AUTH_NINAD3613B06_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});


/**********************
 * Example get method *
 **********************/

app.get('/publish', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});

app.get('/publish/*', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});

/****************************
* Example post method *
****************************/

app.post('/publish', publish);

async function publish(req, res) {
  console.info('publishing')
  let payload = {
    article: {
      title: req.body.title,
      body_markdown: req.body.markdown,
      published: false
    }
  }
  try {
    let res = await fetch(PUBLISH_URL, {
      method: 'post',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'api-key': 'KczcB6vk8cZHyi7dGUVLHJcC'
      }
    })
    let data = await res.json()
    res.json(data)
    // notifySuccess(`<a href="${data.url}/edit" target="_blank" rel="noopener">Go to your post!</a>`)
  } catch(err) {
    console.error(err)
    res.json({error: true})
  }

}

app.post('/publish/*', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

/****************************
* Example put method *
****************************/

app.put('/publish', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

app.put('/publish/*', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

/****************************
* Example delete method *
****************************/

app.delete('/publish', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.delete('/publish/*', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
