'use strict';

angular.module('angularApp')
	.controller('FirmCtrl', function ($scope, firm, architects, structures, LayoutHelper, GraphHelper, Uris) {
		$scope.firm = firm;
		$scope.Uris = Uris;
		$scope.architectRows = LayoutHelper.group(GraphHelper.graphValues(architects), 6);
		console.log("sturctures", structures);
		$scope.structureRows = LayoutHelper.group(GraphHelper.graphValues(structures), 6);
	});
