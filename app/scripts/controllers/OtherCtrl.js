'use strict';

angular.module('qldarchApp').controller('OtherCtrl', function($scope, other, interviews) {
  $scope.other = other;
  $scope.interviews = interviews;
});