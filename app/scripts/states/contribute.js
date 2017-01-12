'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('contribute', {
    url : '/contribute',
    controller : 'ContributeCtrl',
    templateUrl : 'views/contribute.html'
  });
});