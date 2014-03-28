'use strict';

angular.module('angularApp')
    .controller('TimelineViewerCtrl', function ($scope, compoundObject) {
        $scope.compoundObject = compoundObject.jsonData;
        $scope.timeline = compoundObject.jsonData.data;
    });