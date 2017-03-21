'use strict';

angular.module('qldarchApp').controller('ArchitectCtrl', function($scope, architect, interviews, $state, ArchObj) {
  $scope.architect = architect;
  $scope.interviews = interviews;
  $scope.architect.type = 'person';

  $scope.updateArchitect = function(data) {
    if (data.id) {
      ArchObj.updateArchitect(data).then(function() {
        $state.go('architect.summary', {
          architectId : data.id
        });
      }).catch(function(error) {
        console.log('Failed to save', error);
        $state.go('architect.summary.edit', {
          architectId : data.id
        });
      });
    } else {
      ArchObj.createArchitect(data).then(function(response) {
        $state.go('architect.summary', {
          architectId : response.id
        });
      }).catch(function(error) {
        console.log('Failed to save', error);
        $state.go('architect.summary.edit', {
          architectId : data.id
        });
      });
    }
  };

  $scope.cancel = function() {
    if (architect.id) {
      $state.go('architect.summary');
    } else {
      $state.go('architects.queensland');
    }
  };
});