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
            let speech = "I have found " + amount + " restaurants in " + toTitleCase(city) + "." + " One of them is " + toTitleCase(bestResult.name) + ".";
            app.ask(speech, reprompt);
        });
    }
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

