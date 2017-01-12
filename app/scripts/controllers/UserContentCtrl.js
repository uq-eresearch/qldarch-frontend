'use strict';

angular.module('qldarchApp').controller('UserContentCtrl', function($scope, compoundObjects, LayoutHelper) {
  console.log('compoundObjects', compoundObjects);
  $scope.compoundObjectRows = LayoutHelper.group(compoundObjects, 6);
});