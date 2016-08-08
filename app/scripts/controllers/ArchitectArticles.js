'use strict';

angular.module('angularApp')
    .controller('ArchitectArticlesCtrl', function($scope,
                                                  articles) {

        activate();

        function activate() {
            $scope.articles = articles;
        }
    });
