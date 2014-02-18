'use strict';

angular.module('angularApp')
  .controller('BuildingtypologyCtrl', function ($scope, structures, LayoutHelper, buildingTypology) {
		$scope.structures = structures;
		$scope.structureRows = LayoutHelper.group(structures, 6);

		$scope.buildingTypology = buildingTypology;
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
