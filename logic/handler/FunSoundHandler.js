
const Constants = require("./../../config/Constants");

class FunSoundHandler{
	
	constructor(){

	}
	
	doFulfill(app,db){				
		let speech = app.speechBuilder()
        .addText('Yea')
        //.addAudio('https://www.jovo.tech/downloads/pizza.mp3','Piiiizzzaaa');
		
		app.ask(speech);
	}		
}

module.exports = FunSoundHandler;
