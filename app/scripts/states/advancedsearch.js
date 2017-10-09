'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('advancedsearch', {
    url : '/advancedsearch',
    controller : 'AdvancedSearchCtrl',
    templateUrl : 'views/advancedsearch.html',
    resolve : {
      buildingTypologies : [ 'BuildingTypologies', function(BuildingTypologies) {
        return BuildingTypologies.load().then(function(response) {
          return response;
        });
      } ]
    }
  });
});