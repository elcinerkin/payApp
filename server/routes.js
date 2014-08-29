var request = require('request');
var exchange = require('./exchange.js');
var transactions = require('../dB/transactions.js');
var convert = require('./convert.js');
var validated = require('./helperMethods/validate.js');
var q = require('q');

module.exports = function(app){

  // Gets recent transaction activity of the user
	app.get('/paypal/activity', function(req, res){
	  res.send(transactions);
	});

	// Posts to the conversion for calculating the new amount
	app.post('/paypal/currencyConversion', function(req, res){
		if(validated(req.body.from, req.body.to, req.body.amount)){
			convert(req.body.amount, req.body.from, req.body.to, req.body.option)
			.then(function(result){
				res.json({result:result});
			});
		}
		else {
			res.json({result:"Invalid inputs"});
		}
	});

	// Gets the conversion rates
	app.post('/paypal/conversionRates', function(req, res){
		if(validated(req.body.amount, req.body.from, req.body.to)){
			exchange(req.body.to, req.body.from, req.body.option)
			.then(function(result){
				res.json({result:result});
			})
		}
		else {
			res.json({result:"Invalid inputs"});
		}
	});
}