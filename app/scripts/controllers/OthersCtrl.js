'use strict';

angular.module('qldarchApp').controller('OthersCtrl', function($scope, $filter, others, LayoutHelper, GraphHelper) {
  $scope.otherRows = $filter('orderBy')(others, function(other) {
    return other.label;
  });
  $scope.otherRows = LayoutHelper.group(GraphHelper.graphValues($scope.otherRows), 6);
});