

const AllHotelsHandler = require('./handler/AllHotelsHandler');
const HotelSelectionHandler = require('./handler/HotelSelectionHandler');
const HotelDescriptionHandler = require('./handler/HotelDescriptionHandler');
const HotelBedsHandler = require('./handler/HotelBedsHandler');
const HotelPriceHandler = require('./handler/HotelPriceHandler');
const HotelRoomsHandler = require('./handler/HotelRoomsHandler');
const HotelRatingHandler = require('./handler/HotelRatingHandler');
const HotelAddressHandler = require('./handler/HotelAddressHandler');
const HotelContactHandler = require('./handler/HotelContactHandler');
const HotelImagesHander = require('./handler/HotelImagesHandler');

class HandlerContainer{
	constructor(){
		this.allHotelsHandler = new AllHotelsHandler();
		this.hotelSelectionHandler = new HotelSelectionHandler();
		this.hotelDescriptionHandler = new HotelDescriptionHandler();
		this.hotelPriceHandler = new HotelPriceHandler();
		this.hotelBedsHandler = new HotelBedsHandler();
		this.hotelRoomsHandler = new HotelRoomsHandler();	

		this.hotelRatingHandler = new HotelRatingHandler();			
		this.hotelAddressHandler = new HotelAddressHandler();
		this.hotelContactHandler = new HotelContactHandler();		

		this.hotelImagesHandler = new HotelImagesHander();
	}	
	
}

module.exports = HandlerContainer;