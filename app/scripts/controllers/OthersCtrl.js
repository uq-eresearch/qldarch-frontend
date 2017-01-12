'use strict';

angular.module('qldarchApp').controller('OthersCtrl', function($scope, others, LayoutHelper, GraphHelper, $filter) {

  others = $filter('orderBy')(GraphHelper.graphValues(others), function(other) {
    return other.name;
  });

  $scope.otherRows = LayoutHelper.group(GraphHelper.graphValues(others), 6);
});