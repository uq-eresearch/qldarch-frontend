'use strict';

angular.module('angularApp')
	.controller('ArchitectsCtrl', function ($scope, $http, architects, Uris, GraphHelper, LayoutHelper, $filter) {
		var numberInRow = 6;
		var architects = $filter('orderBy')(GraphHelper.graphValues(architects), ['picture', 'name']);
		$scope.architectRows = LayoutHelper.group(GraphHelper.graphValues(architects), 6);
		$scope.Uris = Uris;
	});
