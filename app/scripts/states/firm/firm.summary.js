'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('firm.summary', {
    url : '/summary',
    templateUrl : 'views/firm/summary.html',
    controller : 'FirmCtrl'
  });
});