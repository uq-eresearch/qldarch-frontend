'use strict';

angular.module('angularApp')
	.controller('ArticlesCtrl', function ($scope, articles) {
		$scope.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];
		$scope.articles = articles;
	});
