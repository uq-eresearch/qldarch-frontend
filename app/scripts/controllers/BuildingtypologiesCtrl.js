'use strict';

angular.module('qldarchApp').controller('BuildingtypologiesCtrl', function($scope, buildingTypologies, GraphHelper, LayoutHelper) {
  $scope.awesomeThings = [ 'HTML5 Boilerplate', 'AngularJS', 'Karma' ];

  $scope.buildingTypologies = GraphHelper.graphValues(buildingTypologies);
  $scope.buildingTypologyRows = LayoutHelper.group($scope.buildingTypologies, 6);
});
