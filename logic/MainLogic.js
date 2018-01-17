// =================================================================================
// App Logic
// =================================================================================
const config = require('config');
const app = require('jovo-framework').Jovo;
const mongoose = require('mongoose');
mongoose.connect(config.get("DBUrl"), {useMongoClient: true});
require('../model/FoodEstablishment');

const FoodEstablishments = mongoose.model('FoodEstablishment');
const reprompt = "I can find food establishments for you.";

class Logic {
    constructor() {
    }

    static getHandlers() {
        return {
            'LAUNCH': function () {
                welcomeMessage(app);
            },

            'AskAddress': function () {
                askAddress(app);
            },

            'AskDetails': function () {
                askDetails(app);
            },

            'AskPhone': function () {
                askPhone(app);
            },

            'FindFoodEstablishment': function (city, foodEstablishment) {
                findFoodEstablishment(app, city, foodEstablishment);
            },

            'FindNearbyFoodEstablishment': function (foodEstablishment) {
                findNearbyFoodEstablishment(app, foodEstablishment);
            },

            'NextResult': function () {
                nextResult(app);
            },

            'ShowDetails': function () {
                showDetails(app);
            },

            'ShowResults': function (amount) {
                showResults(app, amount);
            },

            'SpecificResult': function (nth) {
                specificResult(app, nth);
            },

            'AMAZON.HelpIntent': function () {
                helpMessage(app);
            },

            'AMAZON.CancelIntent': function () {
                endMessage(app);
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

function askAddress(app) {
    let latestResult = app.getSessionAttribute("latestResult");
    let speech = "First ask me to find a food establishment for you.";

    if (latestResult) {
        let name = toTitleCase(latestResult.name);
        if (latestResult.sdoAnnotation.address.streetAddress && latestResult.sdoAnnotation.address.postalCode && latestResult.sdoAnnotation.address.addressLocality) {
            speech = "The address of " + name + " is:\n" + latestResult.sdoAnnotation.address.streetAddress + ", " + latestResult.sdoAnnotation.address.postalCode + " " + latestResult.sdoAnnotation.address.addressLocality;
        } else {
            speech = "I'm sorry. I couldn't find the address of  " + name;
        }
    }
    app.ask(speech, reprompt);
}

function askDetails(app) {
    let latestResult = app.getSessionAttribute("latestResult");
    let speech = "First ask me to find a food establishment for you.";

    if (latestResult) {
        let name = toTitleCase(latestResult.name);
        if (latestResult.sdoAnnotation.description) {
            speech = "The description of " + name + " reads as follows:\n" + latestResult.sdoAnnotation.description;
        } else {
            speech = "I'm sorry. I couldn't find a description for  " + name;
        }
    }
    app.ask(speech, reprompt);
}

function askPhone(app) {
    let latestResult = app.getSessionAttribute("latestResult");
    let speech = "First ask me to find a food establishment for you.";

    if (latestResult) {
        let name = toTitleCase(latestResult.name);
        if (latestResult.sdoAnnotation.address.telephone) {
            speech = "The phone number of " + name + " is:\n" + latestResult.sdoAnnotation.address.telephone;
        } else {
            speech = "I'm sorry. I couldn't find a phone number for  " + name;
        }
    }
    app.ask(speech, reprompt);
}

function findFoodEstablishment(app, city, foodEstablishment) {
    // dialog STARTED or IN PROGRESS
    if (app.alexaSkill().isDialogStarted() || app.alexaSkill().isDialogInProgress()) {
        // let alexa handle conversation
        app.alexaSkill().dialogDelegate();
    }
    // dialog completed and all slots filled
    if (app.alexaSkill().isDialogCompleted()) {
        console.log("city: " + city);
        console.log("foodEstablishment: " + foodEstablishment);

        // TODO: sort by rating descending
        FoodEstablishments.find({
            "sdoTypes": parseFoodEstablishment(foodEstablishment),
            "sdoAnnotation.address.addressLocality": new RegExp(city, 'i'),
            "language": "en",
            "rating": {$gt: 0}
        }, function (err, results) {
            let speech = "I'm sorry. I couldn't find a " + foodEstablishment + " in " + toTitleCase(city) + ".";
            let amount = results.length;

            // check if there is a result
            if (amount > 0) {
                let bestResult = results[0];
                // save multiple results to session to get them later again
                if (amount > 1) {
                    let resultsCIDs = [];
                    for (let i = 0; i < amount; i++) {
                        resultsCIDs.push(results[i].CID)
                    }
                    app.setSessionAttribute("resultsCIDs", resultsCIDs);
                }
                // save intent info to session
                app.setSessionAttribute("latestResult", bestResult);
                app.setSessionAttribute("latestResultIndex", 0);
                app.setSessionAttribute("foodEstablishment", foodEstablishment);
                app.setSessionAttribute("city", city);
                speech = "I have found " + amount + " results for " + foodEstablishment + " in " + toTitleCase(city) + "." + " The best result is " + toTitleCase(bestResult.name) + ".";
            } else {
                app.setSessionAttribute("latestResult", null);
            }
            app.ask(speech, reprompt);
        });
    }
}

function findNearbyFoodEstablishment(app, foodEstablishment) {
    // TODO: https://www.jovo.tech/framework/docs/amazon-alexa#user-specific-data
    // https://www.jovo.tech/framework/docs/reference/AlexaDeviceAddress.html
    // https://developer.amazon.com/de/docs/custom-skills/device-address-api.html
    app.ask("Location based search will be enabled in the future.")
}

function nextResult(app) {
    let latestResult = app.getSessionAttribute("latestResult");
    let speech = "First ask me to find a food establishment for you.";

    if (latestResult) {
        let latestResultIndex = app.getSessionAttribute("latestResultIndex");
        let resultsCIDs = app.getSessionAttribute("resultsCIDs");
        latestResultIndex++;
        let nextCID = resultsCIDs[latestResultIndex];

        if (latestResultIndex < resultsCIDs.length) {
            FoodEstablishments.find({
                "CID": nextCID
            }, function (err, results) {
                let currentResult = results[0];
                app.setSessionAttribute("latestResult", currentResult);
                app.setSessionAttribute("latestResultIndex", latestResultIndex);
                speech = "Next result is " + toTitleCase(currentResult.name) + ".";
                app.ask(speech, reprompt);
            });
        } else {
            speech = "No results left.";
            app.setSessionAttribute("latestResult", null);
            app.ask(speech, reprompt);
        }
    }
}

function showDetails(app) {
    let latestResult = app.getSessionAttribute("latestResult");
    let speech = "First ask me to find a food establishment for you.";

    if (latestResult) {
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
        speech = "Done. Open the Amazon Alexa App to view details.";
    }
    app.ask(speech, reprompt);
}

function showResults(app, amount) {
    let latestResult = app.getSessionAttribute("latestResult");
    let speech = "There are no results to show you. Ask me to find a food establishment for you.";

    if (latestResult) {
        let resultsCIDs = app.getSessionAttribute("resultsCIDs");
        let number = 5;
        if (amount !== 'undefined') {
            if (amount > 0 && amount <= resultsCIDs.length) {
                number = amount;
            }
        }
        let CIDsToQuery = [];
        for (let i = 0; i < number; i++) {
            CIDsToQuery.push(resultsCIDs[i])
        }
        if (CIDsToQuery) {
            FoodEstablishments.find({
                "CID": CIDsToQuery
            }, function (err, results) {
                foodEstablishment = app.getSessionAttribute("foodEstablishment");
                city = app.getSessionAttribute("city");
                let title = "Best results for " + toTitleCase(foodEstablishment) + " in " + toTitleCase(city);
                let content = "";
                for (let i = 0; i < results.length; i++) {
                    content = content + getResultText(results[i]) + "\n\n";
                }
                app.alexaSkill().showSimpleCard(title, content);
                speech = "Done. I've sent you the best " + number + " results. Open the Amazon Alexa App to view results.";
                app.ask(speech, reprompt);
            });
        } else {
            speech = "There are only " + resultsCIDs.length + " results. Try again.";
            app.ask(speech, reprompt);
        }
    } else {
        app.ask(speech, reprompt);
    }
}

function getResultText(result) {
    let text = result.name;
    if (result.sdoAnnotation.address.streetAddress && result.sdoAnnotation.address.postalCode && result.sdoAnnotation.address.addressLocality) {
        text = text + " - " + result.sdoAnnotation.address.streetAddress + ", " + result.sdoAnnotation.address.postalCode + " " + result.sdoAnnotation.address.addressLocality;
    }
    return text;
}

function specificResult(app, nth) {
    let latestResult = app.getSessionAttribute("latestResult");
    let speech = "First ask me to find a food establishment for you.";

    if (latestResult) {
        let resultsCIDs = app.getSessionAttribute("resultsCIDs");

        if (nth - 1 < resultsCIDs.length) {
            let nextCID = resultsCIDs[nth - 1];
            FoodEstablishments.find({
                "CID": nextCID
            }, function (err, results) {
                let currentResult = results[0];
                app.setSessionAttribute("latestResult", currentResult);
                app.setSessionAttribute("latestResultIndex", nth - 1);
                speech = "Result number " + nth + " is " + toTitleCase(currentResult.name) + ".";
                app.ask(speech, reprompt);
            });
        } else {
            speech = "There are only " + resultsCIDs.length + " results. Try again.";
            // app.setSessionAttribute("latestResult", null);
            app.ask(speech, reprompt);
        }
    }
}

function helpMessage(app) {
    // TODO: add help message when Intents are almost final
    app.ask("Help message will be available shortly!")
}

function endMessage(app) {
    app.tell("Thanks for using food finder!")
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

// Jovo currently does not support Entity Resolution (https://developer.amazon.com/de/docs/custom-skills/define-synonyms-and-ids-for-slot-type-values-entity-resolution.html)
function parseFoodEstablishment(foodEstablishment) {
    switch (foodEstablishment) {
        case "winery":
            return "Winery";
        case "restaurant":
            return "Restaurant";
        case "bakery":
            return "Bakery";
        case "ice cream shop":
            return "IceCremeShop";
        case "fast food restaurant":
            return "FastFoodRestaurant";
        case "cafe" || "coffee shop":
            return "CafeOrCoffeeShop";
        case "bar" || "pub":
            return "BarOrPub";
    }
}

module.exports = Logic;

