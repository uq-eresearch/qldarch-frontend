'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('architects.create', {
    url : '/create',
    templateUrl : 'views/architect/summary.html'
  });
});