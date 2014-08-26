'use strict';

angular.module('angularApp')
    .controller('RelationshipCtrl', function ($scope, data, GraphHelper, $filter) {
        $scope.relationships = data.relationships;
        $scope.entities = GraphHelper.graphValues(data.entities);

        // Setup the number of times the entity is referenced (inc'd later)
        angular.forEach($scope.entities, function (entity) {
            entity.count = 0;
        });

        // We need to transform the data for d3
        var links = [];
        angular.forEach($scope.relationships, function (relationship) {
            if (relationship.subject && relationship.object) {
                // Do we have any relationships?
                var matchedLinks = $filter('filter')(links, function (link) {
                    if ((link.source.uri === relationship.subject.uri &&
                            link.target.uri === relationship.object.uri) ||
                        (link.target.uri === relationship.subject.uri &&
                            link.source.uri === relationship.object.uri)) {
                        return true;
                    }
                });
                if (matchedLinks.length === 0) {
                    // get the source and target from our list of entities;
                    var source = data.entities[relationship.subject.uri];
                    var target = data.entities[relationship.object.uri];
                    if (!angular.isDefined(source.count)) {
                        source.count = 1;
                    }
                    if (!angular.isDefined(target.count)) {
                        target.count = 1;
                    }
                    var link = {
                        source: source,
                        target: target,
                    };
                    links.push(link);
                } else {
                    var matchedLink = matchedLinks[0];
                    matchedLink.source.count++;
                    matchedLink.target.count++;
                }
            }
        });
        console.log(links);
        console.log($scope.entities);
        $scope.data = {
            nodes: $scope.entities,
            links: links
        };

        // @todo: needs to select a person by default

        $scope.nodeSelected = function (node) {
            $scope.selected = node;
            $scope.selectedRelationships = [];
            if (node) {
                angular.forEach(data.relationships, function (relationship) {
                    if ((angular.isDefined(relationship.subject) && (relationship.subject.uri === node.uri)) ||
                        (angular.isDefined(relationship.object) && (relationship.object.uri === node.uri))) {
                      if(!relationship.implicit || (relationship.implicit && (relationship.implicit === false))) {
                        $scope.selectedRelationships.push(relationship);
                      }
                    }
                });
            }

        };
    });