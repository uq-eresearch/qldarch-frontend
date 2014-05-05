'use strict';

angular.module('angularApp')
    .controller('StructuresCtrl', function($scope, structures, Uris, LayoutHelper, GraphHelper, $filter) {
        var DEFAULT_STRUCTURE_ROW_COUNT = 5;
        $scope.structureRowDisplayCount = DEFAULT_STRUCTURE_ROW_COUNT;

        $scope.structures = $filter('orderBy')(GraphHelper.graphValues(structures), function(structure) {
            return structure.name;
        });
        $scope.structureRows = LayoutHelper.group(GraphHelper.graphValues($scope.structures), 6);

        $scope.addMoreStructureRows = function() {
            $scope.structureRowDisplayCount += 5;
        };

    });
