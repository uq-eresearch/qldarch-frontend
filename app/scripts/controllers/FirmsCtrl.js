'use strict';

angular.module('qldarchApp').controller(
    'FirmsCtrl',
    function($scope, firms, GraphHelper, LayoutHelper, $stateParams, $location, $filter) {

      var DEFAULT_FIRM_ROW_COUNT = 5;
      $scope.firmRowDisplayCount = DEFAULT_FIRM_ROW_COUNT;
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

      firms = $filter('filter')(
          firms,
          function(firm) {
            var startLetter = firm.label.substring(0, 1).toUpperCase();
            if (!isNaN(startLetter)) {
              $scope.indexes['#'] = true;
            } else if (isLetter(startLetter)) {
              $scope.indexes[startLetter] = true;
            }
            if ($stateParams.index && $stateParams.index.length === 1) {
              if (!$stateParams.index || $stateParams.index === 'null' || ($stateParams.index && firm.label.substring(0, 1) === $stateParams.index) ||
                  ($stateParams.index === '#' && !isNaN(firm.label.substring(0, 1)))) {
                return true;
              }
              return false;
            }
            return true;
          });

      firms = $filter('orderBy')(GraphHelper.graphValues(firms), function(firm) {
        return firm.label;
      });

      function frows() {
        /* globals $:false */
        return LayoutHelper.group(GraphHelper.graphValues($.grep(firms, function(firm) {
          if ($stateParams.index) {
            var c0 = firm.label.charAt(0);
            return $stateParams.index === '#' ? $.isNumeric(c0) : (c0.toUpperCase() === $stateParams.index);
          } else {
            return true;
          }
        })), 6);
      }

      $scope.firmRows = frows();
      /**
       * Adds more exchanges to the UI
       */
      $scope.addMoreFirmRows = function() {
        $scope.firmRowDisplayCount += 5;
      };

      $scope.goToIndex = function(index) {
        $location.search({
          index : index
        });
        $stateParams.index = index;
        $scope.firmRows = frows();
      };

    });