'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('other.summary', {
    url : '/summary',
    templateUrl : 'views/other/summary.html',
    controller : 'OtherCtrl'
  });
});