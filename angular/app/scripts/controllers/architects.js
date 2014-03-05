'use strict';

angular.module('angularApp')
    .controller('ArchitectsCtrl', function ($scope, $http, architects, Uris, GraphHelper, LayoutHelper, $filter) {
        architects = $filter('orderBy')(GraphHelper.graphValues(architects), function (architect) {
            return (architect[Uris.FOAF_LAST_NAME] || '') + (architect[Uris.FOAF_FIRST_NAME].toLowerCase() || '');
        });
        $scope.architectRows = LayoutHelper.group(GraphHelper.graphValues(architects), 6);
        $scope.Uris = Uris;
    });