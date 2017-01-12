'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('attributions', {
    url : '/attributions',
    templateUrl : 'views/attributions.html'
  });
});