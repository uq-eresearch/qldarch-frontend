'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('ugc.map.edit', {
    url : '/edit',
    reloadOnSearch : false,
    resolve : {
      typologies : [ 'Entity', 'GraphHelper', function(Entity, GraphHelper) {
        console.log('got to here!');
        return Entity.loadAll('qldarch:BuildingTypology', true).then(function(typologies) {
          return GraphHelper.graphValues(typologies);
        });
      } ]
    },
    views : {
      'builder@ugc' : {
        templateUrl : 'views/ugc/map.builder.html',
        controller : 'MapBuilderCtrl'
      }
    }
  });
});