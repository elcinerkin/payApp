angular.module('currency.controller', [])

.controller('CurrencyCtrl', function($scope, $http){

	$scope.getCurrency = function(){
		var amount = $scope.amount;	
		var from = $scope.from;
		var to = $scope.to;
		var option = $scope.option;

		$http({method: 'POST', url: '/paypal/currencyConversion', data:{amount:amount, to:to, from:from, option:option}})
    		.success(function(data, status, headers, config) {
    			$scope.result = data;
    		})
    		.error(function(error) {
    			console.error('Error while currency conversion: ', error);
    		});
	};
})