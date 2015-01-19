'use strict';

angular.module('angularApp')
    .controller('OthersCtrl', function($scope, others, LayoutHelper, GraphHelper, $filter) {
        // $scope.others = $filter('orderBy')(GraphHelper.graphValues(structures), function (structure) {
        //      return structure.name;
        //  });
        others = $filter('orderBy')(GraphHelper.graphValues(others), function(other) {
            return other.name;
        });

        $scope.otherRows = LayoutHelper.group(GraphHelper.graphValues(others), 6);
    });
