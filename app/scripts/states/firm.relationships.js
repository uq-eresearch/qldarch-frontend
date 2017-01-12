'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('firm.relationships', {
    url : '/relationships',
    templateUrl : 'views/relationships.html',
    resolve : {
      data : [ 'Relationship', 'GraphHelper', 'Entity', '$stateParams', function(Relationship, GraphHelper, Entity, $stateParams) {
        var firmUri = GraphHelper.decodeUriString($stateParams.firmId);
        // Get all the relationships
        return Relationship.findByEntityUri(firmUri).then(function(relationships) {
          return Relationship.getData(relationships);
        });
      } ]
    },
    controller : 'RelationshipCtrl'
  });
});