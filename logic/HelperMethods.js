const Constants = require("./../config/Constants");

class HelperMethods{

	static distanceCalc(lat1, lon1, lat2, lon2) {
	    var p = 0.017453292519943295;    // Math.PI / 180
	    var c = Math.cos;
	    var a = 0.5 - c((lat2 - lat1) * p)/2 +
	        c(lat1 * p) * c(lat2 * p) *
	        (1 - c((lon2 - lon1) * p))/2;

	    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
	}
	
	static formatDate(date){
		let prefix=(date.getDate() < 10 ? "0":"");
		let hourPrefix=(date.getHours() < 10 ? "0":"");
		let minPrefix=(date.getMinutes() < 10 ? "0":"");		
		let secPrefix=(date.getSeconds() < 10 ? "0":"");
		let milliSecPrefix=(date.getMilliseconds()<100 ? "0":"")
		
		return prefix+date.getDate()+"-"+date.getMonth()+1+"-"+date.getFullYear()+" "+hourPrefix+date.getHours()+":"+minPrefix+date.getMinutes()+":"+secPrefix+date.getSeconds()+
		":"+milliSecPrefix+date.getMilliseconds();
	}
	
	static ensureNumber(number){
		return Number(number);
	}

//===
	static extractFrom(sortedAndFormatted) {
        let arr = [];
        sortedAndFormatted.forEach((entry) => {
            arr.push(entry.entry);
        })
        return arr;
    }

	static prepareAndSortHotels(unsorted) {
        let arr = [];
        unsorted.forEach((entry) => {
            arr.push({entry: entry, val: Number(entry.annotation.aggregateRating.ratingValue)});
        })

        arr.sort((a, b) => {
            if (a.val < b.val) {
                return 1;
            } else if (a.val > b.val) {
                return -1;
            }
            return 0;
        })
        return arr;
    }

	static prepareAndSortHotelsPricing(unsorted) {
        let arr = [];

        unsorted.forEach((entry) => {
            arr.push({entry: entry, val: HelperMethods.findSmallestPrice(entry)});
        });

        arr.sort((a, b) => {
            if (a.val < b.val) {
                return -1;
            } else if (a.val > b.val) {
                return 1;
            }
            return 0;
        });
        return arr;
    }

	static formatOutputStructuredSave(data, currency, hitsInTotal,thingtype) {
        let returnString = "To know more about the five ";
        let retObj = {};
        
        if(currency!==""){
            returnString += "cheapest " + thingtype + "s: ";
        }else{
            returnString += "best rated " + thingtype + "s: ";
        }
        
        retObj.initialText = returnString;
        retObj.content = [];
        
        let i = 0;
        data.forEach((entry) => {
            let entryString=""
            if(currency !==""){
            	entryString += "For " + entry.entry.annotation.name + " that costs " + entry.val +" " + currency + ", say  " +(i%Constants.TOP_N+1) + ". ";
            }else{
            	entryString += "For " + entry.entry.annotation.name + " with a rating of " + entry.val +", say "+(i%Constants.TOP_N+1)+". ";
            }
            retObj.content.push(entryString);
            i++;
        });
        let additionalText = "";
        //currently not used
//        if (data.length < hitsInTotal) {
//            additionalText = "I also found " + (hitsInTotal - data.length) + " others."
//        }
        
        retObj.endString = additionalText
        
        return retObj;
    }
	
	static formatOutputStructuredDefault(data, thingType){
        let returnString = "I found the following '"+ thingType+ "' :  '";
        let retObj = {};
        retObj.initialText = returnString;        
        retObj.content = [];
        
        data.forEach((entry)=>{
        	retObj.content.push(entry.annotation.name + ", ")
        })
        
        retObj.endString="";
        
        return retObj;
	}
	
	static formatOutput(data, currency, hitsInTotal,thingtype) {
		let structuredData = HelperMethods.formatOutputStructuredSave(data, currency, hitsInTotal,thingtype);
		let returnString = structuredData.initialText;
		
		structuredData.content.forEach((entry)=>{
			returnString+=entry;
		})
				
        return returnString+structuredData.endString;
    }

	static findSmallestPrice(hotel) {
        let smallestPrice = Number.MAX_VALUE;
        hotel.annotation.makesOffer.forEach((makesOfferEntry) => {
            if (makesOfferEntry.priceSpecification) {
                makesOfferEntry.priceSpecification.forEach((priceEntry) => {
                    if (priceEntry.minPrice < smallestPrice && priceEntry.minPrice !== 0) {
                        smallestPrice = priceEntry.minPrice;
                    }
                })
            }
        })
        return smallestPrice;
    }	
//===	
	
}

module.exports = HelperMethods;
