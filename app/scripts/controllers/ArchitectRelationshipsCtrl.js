'use strict';

angular.module('qldarchApp').controller(
    'ArchitectRelationshipsCtrl',
    function($scope, architect, interviews, data, GraphHelper) {
      $scope.architect = architect;
      $scope.interviews = interviews;
      $scope.sub = 'relationships';
      $scope.relationships = data.relationships;
      $scope.entities = GraphHelper.graphValues(data.entities);

      // We need to transform the data for d3
      var links = [];
      angular.forEach($scope.relationships, function(relationship) {
        if (relationship.subject && relationship.object) {
          var link = {
            source : data.entities[relationship.subject.uri],
            target : data.entities[relationship.object.uri],
          };
          links.push(link);
        }
      });
      $scope.data = {
        nodes : $scope.entities,
        links : links
      };

      $scope.nodeSelected = function(node) {
        $scope.selected = node;
        $scope.selectedRelationships = [];
        angular.forEach(data.relationships, function(relationship) {
          if ((angular.isDefined(relationship.subject) && (relationship.subject.uri === node.uri)) ||
              (angular.isDefined(relationship.object) && (relationship.object.uri === node.uri))) {
            $scope.selectedRelationships.push(relationship);
          }
        });
      };

    });