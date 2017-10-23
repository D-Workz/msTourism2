'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const app = require('jovo-framework').Jovo;
const webhook = require('jovo-framework').Webhook;

const handlers = require("./logic/MainLogic").getHandlers();

// Listen for post requests
webhook.listen(3000, function() {
    console.log('Local development server listening on port 3000.');
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



