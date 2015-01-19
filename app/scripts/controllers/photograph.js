'use strict';

angular.module('angularApp')
    .controller('PhotographCtrl', function ($scope, photograph, Expression, $state) {
        $scope.photograph = photograph;
        $scope.delete = function (photograph) {
            Expression.delete(photograph.uri, photograph).then(function () {
                $state.go(photograph.$state + 's', {});
            });
        };
    });