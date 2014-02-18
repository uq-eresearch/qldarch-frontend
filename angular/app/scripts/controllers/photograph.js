'use strict';

angular.module('angularApp')
	.controller('PhotographCtrl', function ($scope, photograph) {
		$scope.photograph = photograph;
	});
