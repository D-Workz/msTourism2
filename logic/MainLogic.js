// =================================================================================
// App Logic
// =================================================================================
const config = require('config');
const app = require('jovo-framework').Jovo;
const mongoose = require('mongoose');
mongoose.connect(config.get("DBUrl"), {useMongoClient: true});
require('../model/FoodEstablishment');

const FoodEstablishments = mongoose.model('FoodEstablishment');
const reprompt = "I can find restaurants for you.";

class Logic {
    constructor() {
    }

    static getHandlers() {
        return {
            'LAUNCH': function () {
                app.toIntent('Welcome');
            },

            'Welcome': function () {
                welcomeMessage(app);
            },

            'FindRestaurant': function (city) {
                findRestaurant(app, city);
            },

            'ShowDetails': function () {
                showDetails(app);
            },

            'END': function () {
                endMessage(app);
            }
        };
    }

}

function welcomeMessage(app) {
    let speech = "Welcome to food finder, how can I help you?";
    app.ask(speech, reprompt);
}

function findRestaurant(app, city) {
    // dialog STARTED or IN PROGRESS
    if (app.alexaSkill().isDialogStarted() || app.alexaSkill().isDialogInProgress()) {
        // let alexa handle conversation
        app.alexaSkill().dialogDelegate();
    }
    // dialog completed and all slots filled
    if (app.alexaSkill().isDialogCompleted()) {
        console.log("city: " + city);
        // TODO: sort by rating descending
        FoodEstablishments.find({
            "sdoTypes": "Restaurant",
            "sdoAnnotation.address.addressLocality": new RegExp(city, 'i'),
            "language": "en",
            "rating": {$gt: 0}
        }, function (err, restaurants) {
            let amount = restaurants.length;
            let bestResult = restaurants[0];
            app.setSessionAttribute("latestResult", bestResult);
            let speech = "I have found " + amount + " restaurants in " + toTitleCase(city) + "." + " One of them is " + toTitleCase(bestResult.name) + ".";
            app.ask(speech, reprompt);
        });
    }
}

function showDetails(app) {
    let latestResult = app.getSessionAttribute("latestResult");
    let title = toTitleCase(latestResult.name);
    let content = "";
    if (latestResult.sdoAnnotation.address.streetAddress && latestResult.sdoAnnotation.address.postalCode && latestResult.sdoAnnotation.address.addressLocality) {
        content = content + "Address: " + latestResult.sdoAnnotation.address.streetAddress + ", " + latestResult.sdoAnnotation.address.postalCode + " " + latestResult.sdoAnnotation.address.addressLocality + "\n";
    }
    if (latestResult.sdoAnnotation.address.telephone) {
        content = content + "Telephone: " + latestResult.sdoAnnotation.address.telephone + "\n";
    }
    if (latestResult.sdoAnnotation.address.email) {
        content = content + "Mail: " + latestResult.sdoAnnotation.address.email + "\n";
    }
    if (latestResult.sdoAnnotation.address.url) {
        content = content + "Website: " + latestResult.sdoAnnotation.address.url + "\n";
    }
    if (latestResult.sdoAnnotation.description) {
        content = content + "Description:\n" + latestResult.sdoAnnotation.description + "\n";
    }

    app.alexaSkill().showSimpleCard(title, content);

    let speech = "Done. Open the Amazon Alexa App to view details.";
    app.ask(speech, reprompt);
}

function endMessage(app) {
    app.tell("Thanks for using food finder!")
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

module.exports = Logic;

