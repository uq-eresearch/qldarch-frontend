'use strict';

angular.module('angularApp')
	.controller('StructuresCtrl', function ($scope, structures, Uris, LayoutHelper, GraphHelper) {
		$scope.structures = structures;
		$scope.structureRows = LayoutHelper.group(GraphHelper.graphValues(structures), 6);
		$scope.Uris = Uris;
		console.log(structures);
	});
