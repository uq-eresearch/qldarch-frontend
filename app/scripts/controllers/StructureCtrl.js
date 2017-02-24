'use strict';

angular.module('qldarchApp').controller('StructureCtrl', function($scope, structure, designers) {
  $scope.structure = structure;
  $scope.designers = designers;
});