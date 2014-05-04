'use strict';

angular.module('angularApp')
    .controller('UserFilesInterviewsCtrl', function ($scope, expressions) {
        $scope.expressions = expressions;
    });