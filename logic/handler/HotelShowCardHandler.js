const BasicCard = require('jovo-framework').GoogleAction.BasicCard;

class HotelShowCardHandler {

    constructor() {

    }

    doFulfill(app, db) {


        app.db().load("selectedHotel", (err, data) => {

          //  let cardBuilder = app.googleAction().getCardBuilder();
           // let basicCard = cardBuilder.createBasicCard("title","42 is an even composite number. It \n      is composed of three distinct prime numbers multiplied together. It \n      has a total of eight divisors. 42 is an abundant number, because the \n      sum of its proper divisors 54 is greater than itself. To count from \n      1 to 42 would take you about twenty-one…").build();
           // app.googleAction().showBasicCard(basicCard);



            let textString = data.annotation.image[0].caption + "\n Description: \n" + data.annotation.description[0] + "\n + ";


                let basicCard =   new BasicCard()
                .setTitle(data.annotation.name)
                // Image is required if there is no formatted text
                .setImage(data.annotation.image[0].url,
                    'accessibilityText')
                // Formatted text is required if there is no image
                .setFormattedText(textString)
                .addButton('Learn more', data.annotation.url);

            app.googleAction().showBasicCard(basicCard);
            app.ask('What else would you like to know ?');


        });
    }
}
module.exports = HotelShowCardHandler;
