

class AllHotelsHandler{
	
	constructor(database){
		
	}
	
	doFulfill(app, db){
		var nrHotels = app.inputs.number;

		if(nrHotels== null || nrHotels == 0 || nrHotels > 5 || nrHotels < 1){
			nrHotels = 5;
		}

		app.db().load('city',(err,city) => {

            db.find({type: /Hotel/i, "website":new RegExp(city,"i")}).limit(nrHotels).then((data) => {
                var allHotels = "";
                data.forEach((entry) => {
                    var hotelName = entry.annotation.name;
                    allHotels += "'" + hotelName + "', ";
                })

                if (data.length === 0) {
                    app.ask("I didn't find any Hotel in " + place);
                } else {
                    app.db().save('listHotels', data, (err) => {
                        console.log('ListHotels is saved to db');
                        allHotels = allHotels.substring(0, allHotels.length - 2);
                        app.ask("These are the best rated Hotels in "+city+": " + allHotels + ". About which of these do you want to know more ?");
                    });

                }
            });
        });
	}		
}

module.exports = AllHotelsHandler;
