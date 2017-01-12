'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('logout', {
    url : '/logout',
    controller : 'LogoutCtrl'
  });
});