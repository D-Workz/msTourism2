const NR_OF_HOTELS_TO_RETURN = 5;

class HotelFilterHandler{
	
	constructor(){

	}
	
	doFulfill(app,db){
		
		let place = app.inputs.village;
		let ratingVal = app.inputs.ratingVal+"";
		let that = this;
		
		db.find({type:/hotel/i, website: new RegExp(place,"i"), "annotation.aggregateRating.ratingValue" : {$gte : ratingVal}}).then((data)=>{
			if(data.length>0){		
				let sorted=that.prepareAndSortHotels(data.slice(0, NR_OF_HOTELS_TO_RETURN));
				app.ask(that.formatOutput(sorted));
			}
			else{
				app.ask("I'm sorry, I couldn't find any match.");
			}
		})		
	}
	
	prepareAndSortHotels(unsorted){
		let arr = [];
		unsorted.forEach((entry)=>{
			arr.push({entry:entry, val:Number(entry.annotation.aggregateRating.ratingValue)});
		})
		
		arr.sort((a,b)=>{
			if(a.val<b.val){
				return 1;
			}else if(a.val>b.val){
				return -1;
			}return 0;
		})
		
		return arr;
	}
	
	formatOutput(data){
		let returnString = "I found the following Hotels: ";
		data.forEach((entry)=>{
			returnString+=entry.entry.annotation.name+" ("+entry.val+"), ";
		})
		return returnString.substr(0, returnString.length-2);
	}
	
}

module.exports = HotelFilterHandler;
