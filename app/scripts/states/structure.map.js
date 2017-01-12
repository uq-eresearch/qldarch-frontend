'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('structure.map', {
    url : '/map',
    templateUrl : 'views/structure/map.html',
    controller : 'StructureMapCtrl'
  });
});