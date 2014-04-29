'use strict';

angular.module('angularApp')
    .controller('OthersCtrl', function ($scope, others, LayoutHelper, GraphHelper) {
        // $scope.others = $filter('orderBy')(GraphHelper.graphValues(structures), function (structure) {
        //      return structure.name;
        //  });
        console.log('others', others);
        $scope.otherRows = LayoutHelper.group(GraphHelper.graphValues(others), 6);
    });