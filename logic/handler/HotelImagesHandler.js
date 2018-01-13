//const GoogleAction = require('jovo-framework/lib/platforms/googleaction/googleAction').GoogleAction;
const Carousel =   require('jovo-framework/lib/platforms/googleaction/googleAction').GoogleAction.Carousel;
const OptionItem = require('jovo-framework/lib/platforms/googleaction/googleAction').GoogleAction.OptionItem;

class HotelImagesHandler {

    constructor() {

    }

    doFulfill(app, db) {


        app.db().load("selectedHotel", (err, data) => {

            let image = data.annotation.image;
            let carousel = new Carousel();

            if(Array.isArray(image)){

                for(var counter = 0 ; counter < 2 && counter < image.size ; counter ++) {

                    let imageObject = image[counter];
                    if (imageObject) {
                        let url = imageObject.url
                        if (url && url != "") {
                            // let optionItem = new OptionItem();
                            // if(image.caption){optionItem.setTitle(image.caption);}
                            // if(image.description){ optionItem.setDescription(image.description);}
                            //
                            // optionItem.setImage(url, "accesability text");
                            // optionItem.setKey(String.valueOf(counter));
                            //
                            // carousel.addItem(optionItem);

                            app.googleAction().showImageCard("title","test",url);


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

                // carousel.addItem(
                //     (new OptionItem())
                //         .setTitle(image.caption)
                //         .setDescription(image.description)
                //         .setImage(image.url, image.accessibilityText)
                //         .setKey('Carouselitem1key')
                // );

            }


            // app.googleAction().showSuggestionChips(['2','1']);
            // app.googleAction().showCarousel(carousel);


       });
    }
}
    module.exports = HotelImagesHandler;
