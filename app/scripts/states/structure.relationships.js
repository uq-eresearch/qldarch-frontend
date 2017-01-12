'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('structure.relationships', {
    url : '/relationships',
    templateUrl : 'views/relationships.html',
    resolve : {
      data : [ 'Relationship', 'GraphHelper', 'Entity', '$stateParams', function(Relationship, GraphHelper, Entity, $stateParams) {
        var structureUri = GraphHelper.decodeUriString($stateParams.structureId);
        // Get all the relationships
        return Relationship.findByEntityUri(structureUri).then(function(relationships) {
          return Relationship.getData(relationships);
        });
      } ]
    },
    controller : 'RelationshipCtrl'
  });
});