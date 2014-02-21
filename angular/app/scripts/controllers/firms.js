'use strict';

angular.module('angularApp')
    .controller('FirmsCtrl', function ($scope, firms, Uris, GraphHelper, LayoutHelper) {
        $scope.firms = firms;
        $scope.firmRows = LayoutHelper.group(GraphHelper.graphValues(firms), 6);
        $scope.Uris = Uris;
    });