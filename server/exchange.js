var currencies = require('../dB/currencyCodes.js');
var request = require('request');
var fs = require('fs');
var q = require('q');

// Calculates the currency rate
module.exports = test = function(from, to, option){

	var app_id = '89b062f2eb974192941d52b8b36aa731';
	var app_url =  'http://openexchangerates.org/api/latest.json?app_id=';
	var exchangeData, exchangeRate, update = false, parsedData;

	// Decides whether to make an API call or DataStore look-up
	var getDataFromAPIorDataStore = function(){

		// Starts a q promise
		var deferred = q.defer();

		// Checks if user prefers to get update values
		if(option==="true"){							
			// Makes an API call to get live conversion rates
			request(app_url + app_id, function (error, response, body) {
			  	if (!error && response.statusCode == 200) {
			  		exchangeData = body;			// Assigns the body of the request to a local variable
			  		update = true;   				// Raises a flag to update the local DataStore
			  		deferred.resolve();				// Resolves the promise once the data is received
			  	}
			  	else {
			  		console.log('Error getting conversion rates: ', error);
			  	}
			})
		}
		// Reads data from local DataStore
		else {
			fs.readFile('./dB/allExchangeRates.txt', function (error,data) {
		  		if (!error) {
		  			exchangeData = data.toString();	// Assigns the data to a local variable
		  			deferred.resolve();				// Resolves the promise once the data is received
			  	}
			  	else {
			  		console.log('Error reading from file: ', error);
			  	}
			});
		}
		return deferred.promise;					// Returns the resolution
	};

	// Updates DataStore upon the API call to live rates
	var updateDataStore = function(){

		// Starts a q promise
		var deferred = q.defer();					
		var doc = '', data = JSON.parse(exchangeData);

		// Formats the data from the API call to the desired format
		for(var key in data.rates){
			if(currencies[key]){
				var line = key + ' = ' + currencies[key].symbol_native + ' ' + data.rates[key].toFixed(2) + '\n';
			}
			doc+=line;
		}

		// Updates the DataStore with the live rates
		fs.writeFile('./dB/allExchangeRates.txt', doc, function(error, data){
			if(error){
				console.log('Error writing rates into datastore', error);
			}
		});

		// Sets the flag back to false
		update = false;
		deferred.resolve();
		return deferred.promise;
	};

	// Calculates the conversion rate based on the data source upon user preference
	var calculateConversionRate = function(){

		var deferred = q.defer();
		// If user preferred live update rates, get the data from API call 
		if(option === 'true'){
			if(from === 'USD'){
				exchangeRate = parseValuesFromAPICall(to).toFixed(2);
			}
			else {
				exchangeRate = (parseValuesFromAPICall(to)/parseValuesFromAPICall(from)).toFixed(2);
			}
		}
		// Otherwise get data from the DataStore
		else {
			if(from === 'USD'){
				exchangeRate = parseValuesFromDataStore(to);
			}
			else {
				exchangeRate = (parseValuesFromDataStore(to)/parseValuesFromDataStore(from)).toFixed(2);
			}
		}
		deferred.resolve();
		return deferred.promise;
	};

	// Gets rates from DataStore of to and from currencies
	var parseValuesFromDataStore = function(direction){

		// Parses the string to get the corresponding rate
		var indexOfKey = exchangeData.indexOf(direction);
		var indexOfLinebreak = exchangeData.indexOf('\n', indexOfKey);
		var value = exchangeData.substr(indexOfKey, indexOfLinebreak-indexOfKey).split(' ');

		return value[value.length-1];
	};

	// Gets rates from API Call of to and from currencies
	var parseValuesFromAPICall = function(direction){

		// Does an object look-up for the desired currencies 
		var data =  JSON.parse(exchangeData);

		return data.rates[direction];
	};

	// Promise chain returning the exchange rate
	return getDataFromAPIorDataStore()
			.then(function(){
				if(update === true){
					updateDataStore();
				}
			})
			.then(calculateConversionRate)
			.then(function(){
				return exchangeRate;
			});
};
