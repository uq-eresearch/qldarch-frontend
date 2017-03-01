'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('firms', {
    abstract : true,
    url : '/firms',
    templateUrl : 'views/firms/layout.html'
  });
});