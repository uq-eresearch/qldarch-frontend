'use strict';

angular.module('angularApp')
    .controller('ArchitectsCtrl', function ($scope, $http, architects, Uris, GraphHelper, LayoutHelper, $filter) {
        var DEFAULT_ARCHITECT_ROW_COUNT = 5;
        $scope.architectRowDisplayCount = DEFAULT_ARCHITECT_ROW_COUNT;

        architects = $filter('orderBy')(GraphHelper.graphValues(architects), function (architect) {
            return (architect[Uris.FOAF_LAST_NAME] || '') + (architect[Uris.FOAF_FIRST_NAME].toLowerCase() || '');
        });
        $scope.architectRows = LayoutHelper.group(GraphHelper.graphValues(architects), 6);
        $scope.Uris = Uris;

        /**
         * Adds more exchanges to the UI
         */
        $scope.addMoreArchitectRows = function () {
            $scope.architectRowDisplayCount += 5;
        };

    });