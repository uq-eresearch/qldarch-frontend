'use strict';

angular.module('qldarchApp').controller('MainCtrl',
    function($scope, $location, $sce, Uris, Entity, interviews, LayoutHelper, GraphHelper, compoundObjects) {
      $scope.searchType = 'entities';
      $scope.query = '';

      $scope.architectsStart = 0;
      $scope.architectsEnd = 1;
      var architectsPerRow = 5;

      $scope.architectRows = LayoutHelper.group(GraphHelper.graphValues(interviews), architectsPerRow);

      $scope.nextArchitects = function() {
        $scope.architectsStart++;
        $scope.architectsEnd++;
      };
      $scope.prevArchitects = function() {
        $scope.architectsStart--;
        $scope.architectsEnd--;
      };

      $scope.compoundObjectsStart = 0;
      $scope.compoundObjectsEnd = 1;
      var compoundObjectsPerRow = 5;

      var compoundObjectsRows = LayoutHelper.group(compoundObjects, compoundObjectsPerRow);

      $scope.compoundObjectRows = compoundObjectsRows.slice(0, Math.min(4, compoundObjectsRows.length));

      $scope.nextCompoundObjects = function() {
        $scope.compoundObjectsStart++;
        $scope.compoundObjectsEnd++;
      };
      $scope.prevCompoundObjects = function() {
        $scope.compoundObjectsStart--;
        $scope.compoundObjectsEnd--;
      };

      $scope.trustedUrl = function(url) {
        return $sce.trustAsResourceUrl(url);
      };

    });