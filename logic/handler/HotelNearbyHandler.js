const path = require('path');
let CURRENT_FILE = path.basename(__filename);

const mongoose = require('mongoose');
const config = require('config');
const HelperMethods = require('./../HelperMethods');
const Logger = require('./../Logger');
const Constants = require('./../../config/Constants');

mongoose.connect(config.get("DBUrl"), {useMongoClient: true});

require('../../model/Annotation');
const Annotations = mongoose.model('Annotation');
const StringConstants = require("./../../config/Constants");
const QueryBuilder = require("./../QueryBuilder");


class HotelNearbyHandler{
	
	constructor(){
		this.queryBuilder = new QueryBuilder();
	}
	
	doFulfill(app,db, geospatialDb){
		let that=this;
		var hotelName = app.inputs.selectedHotelName;
		let thing = app.inputs.thing;
		let queryRestriction = null;
		
		app.db().load("selectedHotel", (err, hotelEntry) => {

            var helper = hotelEntry.annotation.geo;
    		
			if(helper.longitude && helper.latitude && HelperMethods.ensureNumber(helper.longitude)<=180 && HelperMethods.ensureNumber(helper.latitude)<=90){
				
				let queryGeospatial = this.queryBuilder.buildGeospatialFilter(HelperMethods.ensureNumber(helper.longitude), HelperMethods.ensureNumber(helper.latitude));
				
				geospatialDb.find(queryGeospatial).then((data)=>{
							
							if(data.length>0){
							//build annotationIds
							let annotationIds = [];
							for(let i=0; i<data.length; i++){
								annotationIds.push({annotationId : data[i].annotationID});
							}
							queryRestriction = {$or: annotationIds};
							if(thing!==""){
								queryRestriction.type = new RegExp(thing,"i");
							}
							db.find(queryRestriction).then((annotationEntryData)=>{
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
								//sort things
								let sortedThings = that.sortThingsWithDistance(mergedContent, hotelEntry);
																
    				            app.db().save("listHotels", that.extractFrom(sortedThings), (err) => {
    				            	//save formatted output
    	                        	app.db().save("formattedOutput", that.formatThingsNearbyForSave(sortedThings, hotelEntry.name, thing), (err) => {
    	                        		// reset page count
    	            			    	app.db().save("pageCount", 0, (err) => {
    	            			    		app.followUpState("TemporaryListState").ask(that.formatThingsNearby(sortedThings,hotelEntry),StringConstants.INFO_NOT_UNDERSTAND);
    	            			    	});
    	                        	})          				            	
    				            })																							
							})
						}else{
							Logger.debug(CURRENT_FILE,"Nothing nearby to '"+hotelEntry.name+"'?")
							app
                                .followUpState("ThingKnownState")
								.ask(StringConstants.INFO_NOT_FOUND + "nearby", StringConstants.INFO_NOT_UNDERSTAND);
						}
							
					})					
			}else{
				Logger.warn(CURRENT_FILE,"Invalid geolocations for '"+hotelEntry.name+"'");
				app
                    .followUpState("ThingKnownState")
					.ask("I'm terrible sorry. "+hotelEntry.name+" has invalid or no coordinates set.", StringConstants.INFO_NOT_UNDERSTAND);
			}					
		});		
	}

	extractFrom(sortedAndFormatted){
		let arr = [];
		sortedAndFormatted.forEach((entry)=>{
			arr.push(entry.val);
		})
		return arr;
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
	
	formatThingsNearby(thingsSorted, hotel, thingType){
		let returnString = "";
		let hotelName = hotel.annotation.name;

		let i = 1;
		thingsSorted.slice(0,Constants.TOP_N).forEach((entry)=>{
			let entryType = "";

			if(thingType===""){
				entryType = entry.type+" ";
			}
			
			returnString+= "For "+entryType+"'"+entry.val.name+"' is a "+entry.val.type +" in a distance of "+entry.dist+" km, say "+i;
			i++;
		});
		if(returnString===""){
			return "Sorry, I couldn't find anything nearby of '"+hotelName+"'";
		}
		return "This is what I found near '"+hotelName+"': "+returnString.substr(0, returnString.length-2);
	}
	
	formatThingsNearbyForSave(sortedThings, hotelName, thingType){
        let returnString = "This is what I found near '"+hotelName+"': ";
        let retObj = {};
        retObj.initialText = returnString;        
        retObj.content = [];
        
        sortedThings.forEach((entry)=>{
        	let entryType = "";

			if(thingType===""){
				entryType = entry.type+" ";
			}
						
        	retObj.content.push(entryType+"'"+entry.val.name+"' is a "+entry.val.type +" in a distance of "+entry.dist+" km, ");
        })
        
        retObj.endString="";
                
        return retObj;
	}
	
	sortThingsWithDistance(thingsToSort, hotel){
		let arr=[];
		let hotelLongitude = hotel.annotation.geo.longitude;
		let hotelLatitude = hotel.annotation.geo.latitude;
		
		thingsToSort.forEach((entry)=>{
			let entryLongitude = hotel.annotation.geo.longitude;
			let entryLatitude = entry.annotation.geo.latitude;
			let distance = HelperMethods.distanceCalc(hotelLatitude, hotelLongitude, entryLatitude, entryLongitude).toFixed(3);
			if(distance!=="0.000")
			arr.push({val:entry, dist:distance});
		});
		
		arr.sort((a,b)=>{
			if(a.dist<b.dist){
				return -1;
			}else if(a.dist>b.dist){
				return 1;
			}
			return 0;
		});
		
		return arr;
	}
	
}

module.exports = HotelNearbyHandler;
