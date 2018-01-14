//const GoogleAction = require('jovo-framework/lib/platforms/googleaction/googleAction').GoogleAction;
//const Carousel =   require('jovo-framework/lib/platforms/googleaction/googleAction').GoogleAction.Carousel;
//const OptionItem = require('jovo-framework/lib/platforms/googleaction/googleAction').GoogleAction.OptionItem;

class HotelImagesHandler {

    constructor() {

    }

    doFulfill(app, db) {


        app.db().load("selectedHotel", (err, data) => {

            let image = data.annotation.image;

            if(Array.isArray(image)){

                for(var counter = 0 ; counter < 1 ; counter ++) {

                    let imageObject = image[counter];
                    if (imageObject) {
                        let url = imageObject.url;
                        if (url && url != "") {
                            let title = image.caption;
                            if(!title){
                                title  = data.annotation.name;
                            }


                            app.googleAction().showImageCard(title,title,url);
                            app.ask('What else would you like to know ?');



                            console.log("Image url: " + url);
                        }else{
                            console.log("Image does not contain an url")
                        }

                    } else {
                        // app.ask("I'm terrible sorry, but I could not find the desired information");
                    }
                }


                // app.googleAction().showSuggestionChips(['2','1']);
                // app.googleAction().showCarousel(carousel);
                // app.ask('What else would you like to know ?');

            }else if(image){
                app.googleAction().showImageCard("title","",image.url);
                app.ask('What else would you like to know ?');


            }


       });
    }
}
    module.exports = HotelImagesHandler;
