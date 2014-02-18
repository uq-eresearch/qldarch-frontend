'use strict';

angular.module('angularApp')
	.controller('InterviewsCtrl', function ($scope, interviews, LayoutHelper, GraphHelper, Uris) {
		$scope.interviewRows = LayoutHelper.group(GraphHelper.graphValues(interviews), 4);
		$scope.Uris = Uris;

	});
