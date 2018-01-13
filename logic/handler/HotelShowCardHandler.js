const BasicCard = require('jovo-framework').GoogleAction.BasicCard;

class HotelShowCardHandler {

    constructor() {

    }

    doFulfill(app, db) {


        app.db().load("selectedHotel", (err, data) => {

            let cardBuilder = app.googleAction().getCardBuilder();
           // let basicCard = cardBuilder.createBasicCard("title","42 is an even composite number. It \n      is composed of three distinct prime numbers multiplied together. It \n      has a total of eight divisors. 42 is an abundant number, because the \n      sum of its proper divisors 54 is greater than itself. To count from \n      1 to 42 would take you about twenty-one…").build();
           // app.googleAction().showBasicCard(basicCard);

                let basicCard =   new BasicCard()
                .setTitle('Title')
                // Image is required if there is no formatted text
                .setImage('https://via.placeholder.com/720x480',
                    'accessibilityText')
                // Formatted text is required if there is no image
                .setFormattedText('Formatted Text')
                .addButton('Learn more', 'https://www.jovo.tech (https://www.jovo.tech/)');

            app.googleAction().showBasicCard(basicCard);


            app.ask('What else would you like to know ?');


        });
    }
}
module.exports = HotelShowCardHandler;
