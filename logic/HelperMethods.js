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
		return new Number(number);
	}
	
}

module.exports = HelperMethods;
