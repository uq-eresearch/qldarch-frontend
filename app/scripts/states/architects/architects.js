'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('architects', {
    abstract : true,
    url : '/architects',
    templateUrl : 'views/architects/layout.html'
  });
});