'use strict';

angular.module('angularApp')
    .controller('ArchitectArticlesCtrl', function($scope, architect, interviews, articles) {
        $scope.architect = architect;
        $scope.interviews = interviews;
        $scope.sub = 'articles';
        $scope.articles = articles;
    });
