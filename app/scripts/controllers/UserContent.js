'use strict';

angular.module('angularApp')
    .controller('UserContentCtrl', function ($scope, compoundObjects, LayoutHelper) {
        console.log('compoundObjects', compoundObjects)
        $scope.compoundObjectRows = LayoutHelper.group(compoundObjects, 6);
    });