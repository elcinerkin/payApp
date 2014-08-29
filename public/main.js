angular.module('myApp', [
  'ui.router', 
  'ui.bootstrap', 
  'home.controller',
  'activity.controller',
  'currency.controller'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('home',{ 
  	  url: '/home',
  	  templateUrl: 'templates/home.html',
      controller: 'HomeController'
    })

    .state('transactions', {
      url:'/transactions',
      templateUrl:'templates/transactions.html'
    })

    $urlRouterProvider.otherwise('/transactions');
})