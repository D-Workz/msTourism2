// =================================================================================
// App Logic
// =================================================================================


const app = require('jovo-framework').Jovo;


class Logic {
    constructor() {}

   static getHandlers(){
        return {
            'LAUNCH': function () {
                app.toIntent('HelloWorldIntent');
            },

            'HelloWorldIntent': function () {
                app.tell('Hello noo wakjgsakljy World!');
            },
        };
    }

}

module.exports = Logic;

