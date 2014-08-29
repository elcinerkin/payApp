var currency = require('../../dB/currencyCodes.js')
var _ = require('underscore');

// Validates input arguments
module.exports = validate = function(from, to, amount){

	var validateCurrency = /^[A-Za-z]{3,3}$/;	// Validates alphabet, no special characters and has 3 characters
	var validateAmount = /^[0-9.]{1,10}$/;		// Validates positive numbers, allows decimal points and has max 10 digits
	var amount = amount || 0;					// Ensures amount is defined for routes that doesn't have that property

	if(validateCurrency.test(to) && validateCurrency.test(from)){
		if((_.contains(Object.keys(currency), to)) || (_.contains(Object.keys(currency), from))){
			if(validateAmount.test(amount)){
				from = from.toUpperCase();
				to = to.toUpperCase();
				return true;
			}
		}
	}
	return false;
}
//validate('EUR', 'USD', 112)