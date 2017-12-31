

const AllHotelsHandler = require('./handler/AllHotelsHandler');
const HotelSelectionHandler = require('./handler/HotelSelectionHandler');
const HotelDescriptionHandler = require('./handler/HotelDescriptionHandler');
const HotelBedsHandler = require('./handler/HotelBedsHandler');
const HotelPriceHandler = require('./handler/HotelPriceHandler');
const HotelRoomsHandler = require('./handler/HotelRoomsHandler');
const HotelRatingHandler = require('./handler/HotelRatingHandler');


class HandlerContainer{
	constructor(){
		this.allHotelsHandler = new AllHotelsHandler();
		this.hotelSelectionHandler = new HotelSelectionHandler();
		this.hotelDescriptionHandler = new HotelDescriptionHandler();
		this.hotelPriceHandler = new HotelPriceHandler();
		this.hotelBedsHandler = new HotelBedsHandler();
		this.hotelRoomsHandler = new HotelRoomsHandler();	
		this.hotelRatingHandler = new HotelRatingHandler();			
	}	
	
}

module.exports = HandlerContainer;