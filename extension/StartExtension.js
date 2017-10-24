// =================================================================================
// App Logic
// =================================================================================

const SemantifyExtension = require("./SemantifyExtension");
const config = require('config');

let startParameters =
    "all";
    // "MapsMayrhofen";
    // "MapsSeefeld";
    // "SeefeldAt";
    // "MayrhofenAt";

let allApikeys = config.get("apikey");

class StartExtension {
    constructor(startParameters) {
        this.allApiKeys = [];
        this.timeouthandle;
        this.startParameters = startParameters;
    }
    start(allApikeys){
        if(this.startParameters === "all"){
            for (let apikey in allApikeys) {
                this.allApiKeys.push(apikey);
            }
        }else{
            this.allApiKeys.push(this.startParameters);
        }
        if(this.allApiKeys.length !== 0){
            this.startNewWebsite();
        }
    }

    startNewWebsite(){
        let that = this;
        this.timeouthandle = setTimeout(function () {
            that.startNextWebsite();
        }, 18*100000);
        let firstWebsite = this.allApiKeys[0];
        this.allApiKeys.shift();
        console.log("Website Started: " + firstWebsite);
        let extension = new SemantifyExtension(allApikeys[firstWebsite],firstWebsite, this);
        extension.requestAnnotationsFromSemantify();
    }

    startNextWebsite() {
        clearTimeout(this.timeouthandle);
        if(this.allApiKeys.length === 0){
            console.log("Finished: Getting all Annotations from Semantify.");
        }else{
            this.startNewWebsite();
        }
    }
}

module.exports = StartExtension;


new StartExtension(startParameters).start(allApikeys);
