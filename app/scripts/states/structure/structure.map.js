'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('structure.map', {
    url : '/map',
    templateUrl : 'views/structure/map.html',
    resolve : {
      lat : [ 'structure', function(structure) {
        return structure.lat;
      } ],
      lon : [ 'structure', function(structure) {
        return structure.lon;
      } ]
    },
    controller : 'StructureMapCtrl'
  });
});