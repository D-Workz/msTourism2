const BasicCard = require('jovo-framework').GoogleAction.BasicCard;

class HotelShowCardHandler {

    constructor() {

    }

    doFulfill(app, db) {

    	let that = this;
    	
        app.db().load("selectedHotel", (err, data) => {

          //  let cardBuilder = app.googleAction().getCardBuilder();
           // let basicCard = cardBuilder.createBasicCard("title","42 is an even composite number. It \n      is composed of three distinct prime numbers multiplied together. It \n      has a total of eight divisors. 42 is an abundant number, because the \n      sum of its proper divisors 54 is greater than itself. To count from \n      1 to 42 would take you about twenty-one…").build();
           // app.googleAction().showBasicCard(basicCard);


        	let dataUrl = that.handleObjOrArray(data.annotation.url, "https://semantify.it/");
        	let dataName = (data.annotation.name ? data.annotation.name : "[missing name]");        	
        	let dataDescription=that.handleObjOrArray(data.annotation.description, "No description available");

        	let imageInfo = that.getImageInfo(data.annotation.image);
        	
        	let imgCaption = imageInfo.caption;        	
        	let imgUrl = imageInfo.url;

            let textString = imgCaption + "\n Description: \n" + dataDescription + "\n + ";
            
/*
            console.log("----------")
            console.log("url: "+dataUrl)
            console.log("name:"+dataName)
            console.log("description: "+dataDescription)
            console.log("imgCaption: "+imgCaption)
            console.log("imgUrl: "+imgUrl)
            console.log("----------")
*/            
                let basicCard =   new BasicCard()
                .setTitle(dataName)
                // Image is required if there is no formatted text
                .setImage(imgUrl,
                    'accessibilityText')
                // Formatted text is required if there is no image
                .setFormattedText(textString)
                .addButton('Learn more', dataUrl);

            app.googleAction().showBasicCard(basicCard);
            app.ask('What else would you like to know ?');


        });
    }
    
    getImageInfo(images){
    	if(images){
    		if(Array.isArray(images)){
    			if(images.length>0){
    				return {url:(images[0].url ? images[0].url : "https://semantify.it/images/logo_text.png"), caption:(images[0].caption ? images[0].caption : "No caption available")};
    			}
    		}else{
				return {url:(images.url ? images.url : "https://semantify.it/images/logo_text.png"), caption:(images.caption ? images.caption : "No caption available")};    			
    		}    		
    	}    	
    	return {url:"https://semantify.it/images/logo_text.png", caption:"Showing the default image :-)"};
    }
    
    handleObjOrArray(objOrArr,defaultVal){
    	if(Array.isArray(objOrArr)){
    		if(objOrArr.length>0){
    			return objOrArr[0];
    		}
    		return defaultVal;
    	}else{
    		if(objOrArr){
    			return objOrArr;
    		}
    		return defaultVal;
    	}
    }
    
}
module.exports = HotelShowCardHandler;
