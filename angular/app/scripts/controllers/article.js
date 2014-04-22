'use strict';

angular.module('angularApp')
    .controller('ArticleCtrl', function ($scope, article, Expression, $state) {
        $scope.article = article;

        /**
         * Deletes an article
         * @param  {[type]} article [description]
         * @return {[type]}         [description]
         */
        $scope.delete = function (article) {
            Expression.delete(article.uri, article).then(function () {
                // Success
                $state.go('main');
            }, function (reason) {
                // Failure
                console.log('Something went wrong', reason);
            });
        };
    });