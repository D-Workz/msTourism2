const HelperMethods = require("./HelperMethods");

class Logger{
	
	static logHelper(strToLog, type, file){
		console.log("["+type+" | "+HelperMethods.formatDate(new Date())+" | "+file+"]: "+strToLog);
	}
	
	static log(file, strToLog){
		Logger.logHelper(strToLog,"DEBUG", file);
	}
	
	static warn(file, strToLog){
		Logger.logHelper(strToLog,"WARN ", file);
	}
	
	static error(file, strToLog){
		Logger.logHelper(strToLog,"ERROR", file);
	}
	
}

module.exports = Logger;
