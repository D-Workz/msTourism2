# msTourism

This project uses the [Jovo](https://www.jovo.tech "Jovo's website") framework, to create a voice application for Google Home. 
The Dialog is based on annotations from Mayrhofen and Seefeld. These are required from [semantify.it](https://www.semantify.it "semantify.it's website").

The following README, will first explain, how to setup the project and then go in the second section into more detail concerning the backend. 

The setup description is based on the guide from Jovo of a Sample Voice App for Jovo. 

Thanks for the good tutorial and the easy to use framework. 


# Section 1 Setup

### Getting Started

In this guide, you will learn how to create setup msTourism, which is a Voiceapp for Google Home. 
The content of your communication will be based on Annotations from [semantify.it](https://www.semantify.it "semantify.it's website")

#### Step 1: Download msTourism2

Clone this repository to your coding environment:

```
$ git clone https://github.com/D-Dawg/msTourism2.git
```

This repository includes
* index.js, which includes the webhook used in Dialogflow
* /extension, is an application, which connects to semantify.it and downloads all annotations from the defined apikeys (config file)
* /config, contains a configuration file for the extension and mongoDB 
* /logic, contains the logic of the apllication, what happens under which intend
* /model, the mongoDB model, which holds the annotations
* package.json, including dependencies for msTourism 


Use node package manager to install the dependencies for Jovo ([jovo-framework](https://www.npmjs.com/package/jovo-framework "Jovo NPM Package")):
and for the server of msTourism


```
$ npm install
```

#### Step 2: Install mongoDB

For the server you need mongoDB. 

Follow this guide to install it on your system.

([Install MongoDB](https://docs.mongodb.com/manual/installation/ "MongoDB installation")):

A handy tool is 

([Robomongo](https://robomongo.org/ "Robomongo")): to show your mongoDB collections/databases


#### Step 3: index.js

The index.js file, is configured to use a webhook, which is then called in DIalogFlow. 
As the original guide of Jovo suggests it is a good tool to use ngrok to create an https-address to your localhost

#### Step 4: Run local development server

To start the server, use: 
```
$ node index.js

// It should return this:
Local development server listening on port 3000. <- which is defined in the config file
```

##### Use ngrok to create a link to your local webhook

The problem with running your code locally is that it is not accessible from the outside. This is where [ngrok](https://www.ngrok.com) comes into play. It's a tunneling service that points to your localhost to create an accessible web service. If you don't have ngrok yet, you can install it globally via npm:

```
// Open a new tab in your command line tool, then:
$ npm install ngrok -g

// Point ngrok to your localhost:3000
$ ngrok http 3000
```

Use the secure link and add "/webhook" to it, as shown below.

![alt text](https://www.jovo.tech/img/get-started/ngrok.jpg "ngrok for Alexa and Google Home")

This will be added to the projects on the respective developer platforms of Amazon and Google. Keep the ngrok terminal tab open in the background and move on to the next step.

#### Step 5: Your dialog for Google Home

Google offers [DialogFlow](https://console.dialogflow.com/), to create a Dialog between your server and the Google Assistant. 
If it's your first time to set up a project for Google Assistant, [here's a tutorial](https://developers.google.com/actions/apiai/tutorials/getting-started),

##### Fulfillment: Add Webhook

In the fulfillment section, add the webhook url provided by ngrok. Again, please make sure to append "/webhook".

##### Integrations: Add Google Action

Choose the "Actions on Google" one-click integration and follow the steps to make the integration work. Done!


#### Testing
You can test your Google Action either directly on the [Actions on Google Console](https://console.actions.google.com/), or on your Google Home.

Activate test status in the Simulator. Make sure to use the right invocation (this sometimes defaults to "talk to my test app").

![Using the Simulator to test your Google Action](https://www.jovo.tech/img/get-started/google-test.jpg "Jovo Test with Google Assistant")




Thanks to Jovo, 

## What else can I do with Jovo?

Jovo is still in early beta, so we're still improving and appreciate any feedback!
You can find a reference to all Jovo functions [here](https://www.jovo.tech/framework/docs/).

## We need your help
Jovo is a free, open source framework for voice developers. We're improving it every day and appreciate any feedback. How to support us? Just go ahead and build something cool with the framework and let us know at feedback@jovo.tech. Thanks!



# Section 2 Backend

## Introduction 

The backend has three main parts, the logic, the extension and the mongoDB model. 

* The logic handles the intends coming from Google DialogFlow over the /webhook. 
* The extension requests annotations from semantify.it and saves it in the mongoDB. 
* The mongoDB model, is defining the annotation model. 

## Branches 

* master: is only for readMe and initial server setup
* development: latest development branch, latest working development branches are merged into here (should be working)
* deployment: latest version of the server (working)
---
* all other branches are development branches and under development... (not working)

## Configuration
The backend is configured with the config.json file. 
```
{
  "requestPathListAnnotations": "/api/annotation/list/",
  "requestPathDetailsOfAnnotation": "/api/annotation/cid/",
  "host": "https://semantify.it",
  "DBUrl": "mongodb://localhost:27017/tourism2",
  "port": 3000,
  "apikey": {
    "MayrhofenAt": "HycivrHG-",
    "MapsMayrhofen": "ryJfFtrYZ",
    "MapsSeefeld": "rk8gFtSKW",
    "SeefeldAt": "r1Rpt-rpx"
  },
  "languages": {
    "English": "en"
  },
  "requestFrequencyMilliseconds":{
    "milliseconds": 75
  }
}
```
* The two paths are configuring the way semantify.it is used to obtain the annotations. First a list of all annotations of an “apikey” are requested, then if the annotation has one of the “languages” it is downloaded and saved inside the mongoDB.
* host: defines semantify.it as the host of our annotations. 
* DBUrl: Defines the mongoDB/Tourism2 as our local Database
* port: Our server port
* apikey: All websites, with correct apikeys of semantify.it, registered here will be processed by the extension
* languages: Annotations, in these languages will be requested and saved in the database. 
* requestFrequencyMilliseconds: milliseconds between each request

## The model
The model is called annotation and is organized as following: 
```
    type: {type: String},
    name: {type: String},
    annotation: {type: Object},
    annotationId: {type: String,  unique: true},
    website:{type: String},
    language:{type: String}
```

* type: type of annotation can be multiple 
* name: name of the annotation 
* annotation: the actual annotaion 
* annotationId: id of the annotation used for update 
* website: one of the websites defined in the config.json file
* language: the language of the annotation format: "en", "de"

## Extension 

The extension can be run as a node module using
```
$ node extension\StartExtension.js

```

It uses the configuration of the config.json file 

* host: where to get annotations from 
* paths: which path to obtain annotation 
* apikeys: which websites to parse 
* languages: only annotations in the defined languages will be saved
* requestFrequencyMilliseconds: milliseconds between each request

The extension is desined to run as often as desired, it will update existing annotations and create new ones if required. 
It only requests Annotations, which are in a language defined within the config file. 

## Setup your mongoDB, with annotations
Two  possible ways to create your database "tourism2". 

### Use the dump

The repository contains a folder /mongoDump inside you find dumps of the database. 
The files are organized as: 

```
171117_tourism2 --> YearMonthDay_DBName
```

* Download & unrar the version you want.
* Make sure mongo is running. 
* Navigate into the folder above the unrar result.
* Then execute: 

```
mongorestore -d [your_db_name] [your_dump_dir]

in your case

mongorestore -d tourism2 tourism2/
```

### Run the Extension

Run the extension as described above. 
With the configuration of 75 ms between each request, it will take you around 45 minutes to update your database. 

