'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('user.password', {
    url : '/password',
    controller : 'UserPasswordCtrl',
    templateUrl : 'views/user/user.password.html'
  });
});