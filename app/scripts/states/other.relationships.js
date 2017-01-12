'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('other.relationships', {
    url : '/relationships',
    templateUrl : 'views/relationships.html',
    controller : 'RelationshipCtrl',
    resolve : {
      data : [ 'Relationship', 'GraphHelper', 'Entity', '$stateParams', function(Relationship, GraphHelper, Entity, $stateParams) {
        var uri = GraphHelper.decodeUriString($stateParams.otherId);
        console.log('id is', $stateParams.otherId);
        // Get all the relationships
        return Relationship.findByEntityUri(uri).then(function(relationships) {
          return Relationship.getData(relationships).then(function(data) {
            return data;
          });
        });
      } ]
    }
  });
});