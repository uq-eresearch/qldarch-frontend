'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('architect.summary', {
    url : '/summary',
    templateUrl : 'views/architect/summary.html',
    controller : 'ArchitectCtrl'
  });
});