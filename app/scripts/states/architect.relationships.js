'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('architect.relationships', {
    url : '/relationships',
    templateUrl : 'views/relationships.html',
    controller : 'RelationshipCtrl',
    resolve : {
      data : [ 'Relationship', 'GraphHelper', 'Entity', '$stateParams', function(Relationship, GraphHelper, Entity, $stateParams) {
        var architectUri = GraphHelper.decodeUriString($stateParams.architectId);
        // Get all the relationships
        return Relationship.findByEntityUri(architectUri).then(function(relationships) {
          return Relationship.getData(relationships).then(function(data) {
            console.log('data', data);
            return data;
          });
        });
      } ]
    }
  });
});