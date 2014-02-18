'use strict';

angular.module('angularApp')
  .controller('SearchCtrl', function ($scope, results, $location) {
		$scope.results = results;
		$scope.query = $location.search().query;
  });
