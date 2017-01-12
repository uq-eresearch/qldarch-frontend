'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('register', {
    url : '/register',
    templateUrl : 'views/register.html',
    controller : 'RegisterCtrl'
  });
});