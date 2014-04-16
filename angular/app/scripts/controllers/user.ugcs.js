'use strict';

angular.module('angularApp')
    .controller('UserUgcsCtrl', function ($scope, compoundObjects, LayoutHelper) {
        $scope.compoundObjectRows = LayoutHelper.group(compoundObjects, 6);
    });