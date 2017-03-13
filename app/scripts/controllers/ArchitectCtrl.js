'use strict';

angular.module('qldarchApp').controller('ArchitectCtrl', function($scope, architect, interviews, $state, ArchObjTypeLabels, ArchObj) {
  $scope.architect = architect;
  $scope.interviews = interviews;

  $scope.architect.$type = null;
  for (var type in ArchObjTypeLabels) {
    if (architect.type === type) {
      $scope.architect.$type = {id: type, text: ArchObjTypeLabels[type]};
    }
  }

  $scope.typeSelect = {
      placeholder: 'Select a Type',
      dropdownAutoWidth: true,
      multiple: false,
      query: function (options) {
        var data = {
            results: []
        };
        for (var type in ArchObjTypeLabels) {
          data.results.push({
            id: type,
            text: ArchObjTypeLabels[type]
          });
        }
        options.callback(data);
      }
  };

  $scope.updateArchitect = function (data) {
    if (data.id) {
      ArchObj.updateArchitect(data).then(function() {
        $state.go('architect.summary', {
          architectId: data.id
        });
      }).catch(function (error) {
        console.log('Failed to save', error);
        $state.go('architect.summary.edit', {
          architectId: data.id
        });
      });
    } else {
      console.log('architect', data);
    }
  };

  $scope.cancel = function () {
    if (architect.id) {
      $state.go('architect.summary');
    } else {
      $state.go('architects.queensland');
    }
  };
});