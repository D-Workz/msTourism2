const annotationMerge = require("../../model/Annotation");
const TOP_N = 5;

class HotelNearbyHandler{
	
	constructor(){

	}
	
	doFulfill(app,db, geospatialDb){
		let that=this;
		var hotelName = app.inputs.selectedHotelName;

		app.db().load("selectedHotel", (err, hotelEntry) => {

            var helper = hotelEntry.annotation.geo;
    		
			if(helper.longitude && helper.latitude && helper.longitude<=180 && helper.latitude<=90){
				geospatialDb.find({
					"geoInfo": { 
						$near : {
							      $geometry: { type: "Point",  coordinates: [ helper.longitude, helper.latitude ] },
							      $minDistance: 0,
							      $maxDistance: 1000
						         }
						      }
						   }
						).then(function(data){
							
							//build annotationIds
							let annotationIds = [];
							for(let i=0; i<data.length; i++){
								annotationIds.push({annotationId : data[i].annotationID});
							}
							db.find({$or: annotationIds}).then(function(annotationEntryData){
								let duplicateAnnotations = [];
								annotationEntryData.forEach(function(annotationEntry){
									let toAdd = that.findDuplicateAnnotation(annotationEntry, annotationEntryData);
									let duplicateEntry = [];
									duplicateEntry.push(annotationEntry);
									if(toAdd!==null){
										duplicateEntry.push(toAdd);
									}
									duplicateAnnotations.push(duplicateEntry);
								})
								
								let mergedContent = [];
								duplicateAnnotations.forEach(function(duplicatedEntry){
									if(duplicatedEntry.length==2){
										mergedContent.push(annotationMerge.mergeAnnotationTypes(duplicatedEntry[0],duplicatedEntry[1]));
									}
									else{
										mergedContent.push(duplicatedEntry[0]);
									}
								})
								
								app.ask(that.formatThingsNearby(mergedContent,hotelEntry.name));							
							})
						})					
			}else{
				app.ask("I'm terrible sorry. Hotel '"+hotelEntry.name+"' has invalid or no coordinates set.");
			}
				
			
		
		});		
	}
	
	
	findDuplicateAnnotation(obj, list){
		list.forEach(function(entry){
			if(entry.name.toLowerCase() === obj.name.toLowerCase() && entry.type.toLowerCase() === entry.type.toLowerCase()){
				return entry;
			}
		})
		return null;
	}
	
	formatThingsNearby(things, hotelName){
		let returnString = "";
		things.slice(0,TOP_N).forEach(function(entry){
			returnString+=entry.type+" '"+entry.name+"', ";
		})
		if(returnString===""){
			return "Sorry, I couldn't find anything nearby of '"+hotelName+"'";
		}
		return "I found the following things near '"+hotelName+"': "+returnString.substr(0, returnString.length-2);
	}
	
}

module.exports = HotelNearbyHandler;
