'use strict';

angular.module('angularApp')
    .controller('FirmsCtrl', function ($scope, firms, Uris, GraphHelper, LayoutHelper) {
        var DEFAULT_FIRM_ROW_COUNT = 5;
        $scope.firmRowDisplayCount = DEFAULT_FIRM_ROW_COUNT;

        $scope.firms = firms;
        $scope.firmRows = LayoutHelper.group(GraphHelper.graphValues(firms), 6);

        /**
         * Adds more exchanges to the UI
         */
        $scope.addMoreFirmRows = function () {
            $scope.firmRowDisplayCount += 5;
        };

    });