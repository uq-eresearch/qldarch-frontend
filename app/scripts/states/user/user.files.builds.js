'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('user.files.builds', {
    url : '/builds',
    resolve : {},
    controller : 'UserUgcsCtrl',
    templateUrl : 'views/user.files.builds.html'
  });
});