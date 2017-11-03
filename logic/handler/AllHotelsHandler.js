

class AllHotelsHandler{
	
	constructor(database){
		
	}
	
	doFulfill(app, db){
		var nrHotels = app.inputs.number;
		var place = app.inputs.villages;
		
		db.aggregate({$unwind:"$annotations"},{$match:{type:"Hotel"}},{$limit: nrHotels}).then((data) => {
			var allHotels = "";
			data.forEach((entry) => {
				var hotelName = entry.annotations.annotation.name;			
				allHotels += "'"+hotelName+"', ";
			})
			if(data.length===0){
				app.tell("I didn't find any Hotel in "+place);
			}else{
				allHotels = allHotels.substring(0,allHotels.length-2);
				app.tell("I found the following Hotels for you: "+allHotels);
			}			
		});
	}		
}

module.exports = AllHotelsHandler;
