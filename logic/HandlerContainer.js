

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
const HotelDistanceCityCenterHandler = require('./handler/HotelDistanceCityCenterHandler');
const HotelNearbyHandler = require('./handler/HotelNearbyHandler');
const GenericThingDescriptionHandler = require('./handler/GenericThingDescriptionHandler');
const HotelShowCardHandler = require('./handler/HotelShowCardHandler');
const HotelFilterHandler = require('./handler/HotelFilterHandler');
const HotelSelectionAfterListHandler = require('./handler/HotelSelectionAfterListHandler');
const InitialChooseCityHandler = require('./handler/InitialChooseCityHandler');


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
		this.hotelDistanceCityCenterHandler = new HotelDistanceCityCenterHandler();
		this.hotelShowCardHandler = new HotelShowCardHandler();
		this.hotelNearbyHandler = new HotelNearbyHandler();
		this.genericThingDescriptionHandler = new GenericThingDescriptionHandler();
		
		this.hotelFilterHandler = new HotelFilterHandler();
		this.hotelSelectionAfterListHandler = new HotelSelectionAfterListHandler();
		this.initialChooseCityHandler = new InitialChooseCityHandler();
	}
	
}

module.exports = HandlerContainer;