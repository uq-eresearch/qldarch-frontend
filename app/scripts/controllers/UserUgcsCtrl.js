'use strict';

angular.module('qldarchApp').controller('UserUgcsCtrl', function($scope, compoundObjects, LayoutHelper) {
  $scope.compoundObjectRows = LayoutHelper.group(compoundObjects, 6);
});