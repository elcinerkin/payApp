var request = require('request');
var exchange = require('./exchange');
var currency = require('../dB/currencyCodes');
var _ = require('underscore');
var q = require('q');

// Gets the user parameters and converts it to desired currency and 
module.exports = function(amount, from, to, option){
	
	// Returns promise for converted value
	return exchange(from, to, option)			// Gets the exchange rate
		.then(function(val){					// Calculates the new currency
			return (val*amount).toFixed(2);		// 
	});				
}