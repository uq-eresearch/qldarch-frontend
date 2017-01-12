'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('login', {
    url : '/login',
    templateUrl : 'views/login.html',
    controller : 'LoginCtrl'
  });
});