const mongoose = require('mongoose');
const config = require('config');
const helperMethodsStatic = require('./../HelperMethods');

const TOP_N = 5;
mongoose.connect(config.get("DBUrl"), {useMongoClient: true});

require('../../model/Annotation');
const Annotations = mongoose.model('Annotation');

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
						).then((data)=>{
							
							//build annotationIds
							let annotationIds = [];
							for(let i=0; i<data.length; i++){
								annotationIds.push({annotationId : data[i].annotationID});
							}
							db.find({$or: annotationIds}).then((annotationEntryData)=>{
								let duplicateAnnotations = [];
								annotationEntryData.forEach((annotationEntry)=>{
									let toAdd = that.findDuplicateAnnotation(annotationEntry, annotationEntryData);
									let duplicateEntry = [];
									duplicateEntry.push(annotationEntry);
									if(toAdd!==null){
										duplicateEntry.push(toAdd);
									}
									duplicateAnnotations.push(duplicateEntry);
								})
								
								let mergedContent = [];
								duplicateAnnotations.forEach((duplicatedEntry)=>{
									if(duplicatedEntry.length==2){
										mergedContent.push(Annotations.mergeAnnotations(duplicatedEntry[0],duplicatedEntry[1]));
									}
									else{
										mergedContent.push(duplicatedEntry[0]);
									}
								})
								
								app.ask(that.formatThingsNearby(mergedContent,hotelEntry));							
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
	
	buildMapsMapper(thingWithGeo){
		return "https://www.google.com/maps/search/?api=1&query="+thingWithGeo.annotation.geo.latitude+","+thingWithGeo.annotation.geo.longitude;
	}
	
	formatThingsNearby(things, hotel){
		let returnString = "";
		let hotelName = hotel.annotation.name;
		let hotelLongitude = hotel.annotation.geo.longitude;
		let hotelLatitude = hotel.annotation.geo.latitude;
		let that = this;
		things.slice(0,TOP_N).forEach((entry)=>{
			let entryLongitude = hotel.annotation.geo.longitude;
			let entryLatitude = entry.annotation.geo.latitude;
			returnString+=entry.type+" '"+entry.name+"' ("+helperMethodsStatic.distanceCalc(hotelLatitude, hotelLongitude, entryLatitude, entryLongitude).toFixed(2)+" km), ";
		})
		if(returnString===""){
			return "Sorry, I couldn't find anything nearby of '"+hotelName+"'";
		}
		return "I found the following things near '"+hotelName+"': "+returnString.substr(0, returnString.length-2);
	}
	
}

module.exports = HotelNearbyHandler;
