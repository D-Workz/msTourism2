const Constants = require("./../../config/Constants");
const Logger = require('./../Logger');
const HelperMethods = require('./../HelperMethods');

class ListPagingHandler{
	
	constructor(){

	}
	
	doFulfill(app,db, followUpState){
		let that=this;
		// load query information to redo the query
			app.db().load("pageCount", (errPageCount, pageCount) => {				
				pageCount+=1;
				app.db().load("formattedOutput", (errFormattedOutput, outputObj) => {				
					// increase page count
			    	app.db().save("pageCount", pageCount, (err) => {
						// redo last query
				    	app.followUpState(followUpState).ask(that.buildResponse(outputObj, pageCount, Constants.TOP_N));
			    	});
				});	

			});            
	}		
	
	
	buildResponse(outputObj, page, sliceSize){
		if(outputObj.content.length>0){
			let initialText = outputObj.initialText;
			let contentArr = outputObj.content;
			let endText = outputObj.endString;
			
			let startIndex = page*sliceSize;
			if(startIndex>contentArr.length-1){
				startIndex = 0;
			}
			
			let responseString = "";
			
			if(page===0){
				responseString = initialText;
			}
			
			contentArr.slice(startIndex, startIndex+sliceSize).forEach((entry)=>{
				responseString+=entry;
			})
			
			return responseString+endText;
		}
		return "I'm sorry, I couldn't find anymore.";
	}
	
}

module.exports = ListPagingHandler;
