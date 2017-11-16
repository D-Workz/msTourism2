# msTourism

This project uses the [Jovo](https://www.jovo.tech "Jovo's website") framework, to create a voice application for Google Home. 
The Dialog is based on annotations from Mayrhofen and Seefeld. These are required from [semantify.it](https://www.semantify.it "semantify.it's website").

The next section will explain how to setup the server and google dialogflow. 
The setup description is based on the guide from Jovo of a Sample Voice App for Jovo. 

Thanks for the good tutorial and the easy to use framework. 


## Setup

### Getting Started

In this guide, you will learn how to create setup msTourism, which is a Voiceapp for Google Home. 
The content of your communication will be based on Annotations from [semantify.it](https://www.semantify.it "semantify.it's website")

#### Step 1: Download msTourism

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

[Install MongoDB](https://docs.mongodb.com/manual/installation/ "MongoDB installation")

A handy tool is 

[Robomongo](https://robomongo.org/ "Robomongo") to show your mongoDB collections/databases


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
