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

            if(image.isArray()){

                for(var counter = 0 ; counter < 3 ; counter ++) {

                    let imageObject = image[counter];
                    if (imageObject) {
                        let url = imageObject.url
                        if (url && url != "") {
                            let optionItem = new OptionItem();

                            optionItem.setTitle('Image ' + (counter + 1));
                            optionItem.setDescription('desc');
                            optionItem.setImage(url, "accesability text");

                            carousel.addItem(optionItem);

                            console.log("Image url: " + url);
                        }
                    } else {
                        // app.ask("I'm terrible sorry, but I could not find the desired information");
                    }
                }
            }else if(image){
                carousel.addItem(
                    (new OptionItem())
                        .setTitle(image.title)
                        .setDescription(image.description)
                        .setImage(image.url, image.accessibilityText)
                        .setKey('Carouselitem1key')
                );

            }







            app.googleAction().showCarousel(carousel);

            //not needed i think
           // app.googleAction().showSuggestionChips(['List', 'Carousel', 'Basic card']);

            app.ask('What else would you like to know ?');



            //        carousel.addItem(new OptionItem().setTitle("tit").setDescription("desc").setImage("http://resc.deskline.net/images/ZIL/1/f395beb0-fa4a-4d46-b15d-050da7a26682/99/image.jpg", "accesability text"));
            //carousel.addItem(new OptionItem().setTitle("tit2").setDescription("desc2").setImage("http://resc.deskline.net/images/ZIL/1/f260ec36-f363-4e74-8e8f-0c45016707f0/99/image.jpg", "accesability text2"));
                   // console.log("Image url: "+url);


          //  let  googleAction = new GoogleAction(app,app.request);


//            googleAction.showCarousel(carousel);
  //          googleAction.showSuggestionChips(["Other thing","not part of the list","3"]).ask("ch1","ch2");


            // app.googleAction().showCarousel(carousel);
            // app.googleAction().showSuggestionChips(["Other thing","not part of the list","3"])
            // app.ask(["choose 1","choose 2");


        });
    }
}
    module.exports = HotelImagesHandler;
