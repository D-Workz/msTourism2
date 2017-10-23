// =================================================================================
// App Logic
// =================================================================================

const SemantifyExtension = require("./SemantifyExtension");
const config = require('config');
const RateLimiter = require('limiter').RateLimiter;
let limiter = new RateLimiter(1, 50000000);

let allApikeys = config.get("apikey");


for (let apikey in allApikeys) {

    limiter.removeTokens(1, function () {
        let extension = new SemantifyExtension(allApikeys[apikey],apikey);
        extension.requestAnnotationsFromSemantify();
    });


}

