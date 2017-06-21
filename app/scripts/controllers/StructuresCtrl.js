'use strict';

angular.module('qldarchApp').controller('StructuresCtrl',
    function($scope, structures, LayoutHelper, GraphHelper, $stateParams, $location, $filter, $state) {
      var DEFAULT_STRUCTURE_ROW_COUNT = 5;
      $scope.structureRowDisplayCount = DEFAULT_STRUCTURE_ROW_COUNT;

      $scope.$stateParams = $stateParams;
      $scope.indexes = {
        '#' : false,
        'A' : false,
        'B' : false,
        'C' : false,
        'D' : false,
        'E' : false,
        'F' : false,
        'G' : false,
        'H' : false,
        'I' : false,
        'J' : false,
        'K' : false,
        'L' : false,
        'M' : false,
        'N' : false,
        'O' : false,
        'P' : false,
        'Q' : false,
        'R' : false,
        'S' : false,
        'T' : false,
        'U' : false,
        'V' : false,
        'W' : false,
        'X' : false,
        'Y' : false,
        'Z' : false
      };

      function isLetter(char) {
        return char.match(/[a-z]/i);
      }

      $scope.structures = $filter('filter')(GraphHelper.graphValues(structures), function(structure) {
        var startLetter = structure.label.substring(0, 1).toUpperCase();
        if (!isNaN(startLetter)) {
          $scope.indexes['#'] = true;
        } else if (isLetter(startLetter)) {
          $scope.indexes[startLetter] = true;
        }
        if ($stateParams.index && $stateParams.index.length === 1) {
          if (!isNaN(startLetter) && '#' === $stateParams.index) {
            return true;
          } else if (isLetter($stateParams.index) && startLetter === $stateParams.index) {
            return true;
          }
          return false;
        }
        return true;
      });

      $scope.structures = $filter('orderBy')(GraphHelper.graphValues($scope.structures), function(structure) {
        return structure.label;
      });
      $scope.structureRows = LayoutHelper.group(GraphHelper.graphValues($scope.structures), 6);

      $scope.goToIndex = function(index) {
        $state.go($state.current.name, {
          index : index
        });
      };

      $scope.addMoreStructureRows = function() {
        $scope.structureRowDisplayCount += 5;
      };

    });