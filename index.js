'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const app = require('jovo-framework').Jovo;
const webhook = require('jovo-framework').Webhook;
const config = require('config');

const handlers = require("./logic/MainLogic").getHandlers();

// Listen for post requests
webhook.listen(config.get("port"), function() {
    console.log('Local development server listening on port.'+  config.get("port"));
});

webhook.post('/webhook', function(req, res) {
    app.handleRequest(req, res, handlers);
    app.execute();
});



webhook.get('/hans', function(req, res) {
    app.handleRequest(req, res, handlers);
    res.json({hans:"hans00"});
    app.execute();
});



