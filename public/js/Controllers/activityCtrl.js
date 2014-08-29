angular.module('activity.controller',[])

.controller('ActivityCtrl', function ($scope, Activity) {

   Activity.getActivities().then(function(response){
   	  $scope.activity = response.data.transactions;
   })
   .catch(function(err){
       console.error('Error:', err);
   });
})

.factory('Activity', function($http){

    var Activity = {};

    Activity.getActivities = function(){
        return $http.get('/paypal/activity');
    };
    
	return Activity;
})