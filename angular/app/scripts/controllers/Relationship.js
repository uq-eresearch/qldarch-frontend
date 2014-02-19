'use strict';

angular.module('angularApp')
    .controller('RelationshipCtrl', function ($scope, data, GraphHelper) {
        $scope.relationships = data.relationships;
        $scope.entities = GraphHelper.graphValues(data.entities);

        // We need to transform the data for d3
        var links = [];
        angular.forEach($scope.relationships, function (relationship) {
            if (relationship.subject && relationship.object) {
                var link = {
                    source: data.entities[relationship.subject.uri],
                    target: data.entities[relationship.object.uri],
                };
                links.push(link);
            }
        });
        $scope.data = {
            nodes: $scope.entities,
            links: links
        };

        // @todo: needs to select a person by default

        $scope.nodeSelected = function (node) {
            $scope.selected = node;
            $scope.selectedRelationships = [];
            angular.forEach(data.relationships, function (relationship) {
                if ((angular.isDefined(relationship.subject) && (relationship.subject.uri === node.uri)) ||
                    (angular.isDefined(relationship.object) && (relationship.object.uri === node.uri))) {
                    $scope.selectedRelationships.push(relationship);
                }
            });
        };
    });