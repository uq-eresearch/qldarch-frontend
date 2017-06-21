'use strict';

angular.module('qldarchApp').controller('AdminMergeCtrl', function($scope) {

  $scope.merge = function() {
  };

  // Setup the entity select boxes
  $scope.entitySelect = {
    placeholder : 'Architect, Project, Firm or Other',
    dropdownAutoWidth : true,
    multiple : false
  };

});