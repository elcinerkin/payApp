var exchange = require('../server/exchange.js');
var convert = require('../server/convert.js');
var validate = require('../server/helperMethods/validate.js');

var assert = require("assert")

describe('validated()', function () {
  it('should validate correctly formated arguments', function(){
  	assert.equal(true, validate('EUR', 'USD', 222))
  });

  it('should reject inputs longer then 3 characters', function  () {
    assert.equal(false, validate('EURO', 'US'))
  });

  it('should reject non-decimal amounts', function () {
  	assert.equal(false, validate('EUR', 'USD', 'XYZ'));
  });

  it('should reject currencies that are not defined in api data', function () {
  	assert.equal(false, validate('XXX', 'YYY', 234))
  });

  it('should reject wrong number of arguments', function(){
  	assert.equal(false, validate('EUR'))
  });

});


describe('exchange()', function(){
    it('should get return the exchange rate for given currencies', function(done){
    	assert.equal(0.74, exchange('USD', 'EUR', 'true'))
	});

    it('should return invalid inputs warning when the arguments are invalid', function(done){
    	assert.equal("Invalid inputs", exchange('USA', 'EUR', 'true'))
	});
})


describe('convert()', function(){
    it('should get convert given amount to desired currency', function(done){
    	assert.equal(230, convert(100, 'USD', 'TRY', 'true'))
	});

    it('should return invalid inputs warning when the arguments are invalid', function(done){
    	assert.equal("Invalid inputs", exchange('USA', 'EUR', 'true'))
	});
})