'use strict';

angular.module('angularApp')
	.controller('ArticleCtrl', function ($scope, article) {
		$scope.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		$scope.article = article;
	});
