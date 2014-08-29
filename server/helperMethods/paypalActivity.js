var request = require('request');
var q = require('q');

module.exports = getActivity = function(){

  var token, transactions;

  var getAuthorizationToken = function(){
    
    var deferred = q.defer();
    var base64 = new Buffer('<put_your_client_credentials_here>').toString('base64');
    var paypalUrl = 'https://api.sandbox.paypal.com/v1/oauth2/token';
    var options = {
      url : paypalUrl,
      headers: {
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'Authorization': 'Basic ' +'"' + base64 + '"',
      'content-type': 'application/x-www-form-urlencoded'},
      form:{
      'grant_type':'client_credentials'}
    };  

    var callback = function(error, response, body){
      if (!error && response.statusCode == 200) {
        token = JSON.parse(body).access_token;
        console.log('access token is ', token);
        deferred.resolve();
      }
      else {
        console.log('Error:',error);
      }
    };  

    request.post(options, callback);
    return deferred.promise;
  }


  var getTransactions = function(){

    var deferred = q.defer();
    var paypalUrl = 'https://api.sandbox.paypal.com/v1/payments/payment';
    var options = {
      url : paypalUrl,
      headers:{
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ token }
    };

    var callback = function(error, response, body){
      var data = JSON.parse(body);
      transactions = 
      deferred.resolve();
      console.log('response body is;', data);
    }

    request(options, callback)
    return deferred.promise;
  }

	return getAuthorizationToken()
	.then(getTransactions)
	.then(function(){
	  return transactions;
	});

}