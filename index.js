'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const app = require('jovo-framework').Jovo;
const webhook = require('jovo-framework').Webhook;
const config = require('config');

const handlers = require("./logic/MainLogic").getHandlers();

// let myIntentsToSkipUnhandled = [
//     'CancelIntent',
//     'HelpIntent',
// ];

// Use the setter
//app.setIntentsToSkipUnhandled(myIntentsToSkipUnhandled);

// Use setConfig
// app.setConfig({
//     intentsToSkipUnhandled: myIntentsToSkipUnhandled,
//     // Other configurations
// });

// Listen for post requests
webhook.listen(config.get("port"), function() {
    console.log('Local development server listening on port.'+  config.get("port"));
});

webhook.post('/webhook', function(req, res) {
    app.handleRequest(req, res, handlers);
    app.execute();
});



webhook.get('/hans', function(req, res) {
    res.json({hans:"hansoihkj00c"});
});



