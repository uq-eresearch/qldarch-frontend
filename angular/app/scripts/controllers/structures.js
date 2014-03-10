'use strict';

angular.module('angularApp')
    .controller('StructuresCtrl', function ($scope, structures, Uris, LayoutHelper, GraphHelper) {
        var DEFAULT_STRUCTURE_ROW_COUNT = 5;
        $scope.structureRowDisplayCount = DEFAULT_STRUCTURE_ROW_COUNT;

        $scope.structures = structures;
        $scope.structureRows = LayoutHelper.group(GraphHelper.graphValues(structures), 6);

        $scope.addMoreStructureRows = function () {
            $scope.structureRowDisplayCount += 5;
        };

    });