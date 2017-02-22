'use strict';

angular.module('qldarchApp').controller('ArchitectCtrl', function($scope, architect, interviews) {
  $scope.architect = architect;
  $scope.interviews = interviews;
});