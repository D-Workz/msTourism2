

class AllHotelsHandler{
	
	constructor(database){
		
	}
	
	doFulfill(app, db){
		let nrHotels = app.inputs.number;
		let place = app.inputs.villages;
		let filter = app.inputs.filter;
		
		if(nrHotels== null || nrHotels === 0){
			nrHotels = 5;
		}
		
		db.find({type:/Hotel/}).limit(nrHotels).then((data) => {
			let allHotels = "";
			data.forEach((entry) => {
				let hotelName = entry.annotation.name;			
				allHotels += "'"+hotelName+"', ";
			})

			if(data.length===0){
				app.ask("I didn't find any Hotel in "+place);
			}else{
				allHotels = allHotels.substring(0,allHotels.length-2);
				app.ask("I found the following Hotels for you: "+allHotels);
			}			
		});
	}		
}

module.exports = AllHotelsHandler;
