'use strict';

angular.module('angularApp')
    .controller('UserFilesDocumentsCtrl', function ($scope, expressions) {
        $scope.expressions = expressions;
    });