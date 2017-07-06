'use strict';

angular.module('qldarchApp').controller('StructureCtrl', function($scope, structure, designers, ArchObj, $filter, buildingTypologies, $state) {
  $scope.structure = structure;
  $scope.designers = designers;

  $scope.structure.type = 'structure';

  $scope.structure.$typologies = null;
  if (angular.isDefined(structure.typologies)) {
    $scope.structure.$typologies = [];
    angular.forEach(structure.typologies, function(typo) {
      for ( var typology in buildingTypologies) {
        if (typo === buildingTypologies[typology]) {
          $scope.structure.$typologies.push({
            id : typology,
            text : buildingTypologies[typology]
          });
        }
      }
    });
  }

  $scope.typologySelect = {
    placeholder : 'Select a Building Typology',
    dropdownAutoWidth : true,
    multiple : true,
    query : function(options) {
      var data = {
        results : []
      };
      for ( var typology in buildingTypologies) {
        data.results.push({
          id : typology,
          text : buildingTypologies[typology]
        });
      }
      options.callback(data);
    }
  };

  $scope.updateStructure = function(data) {
    if (data.id) {
      ArchObj.updateStructure(data).then(function() {
        $state.go('structure.summary', {
          structureId : data.id
        }, {
          reload : true
        });
      }).catch(function(error) {
        console.log('Failed to save', error);
        $state.go('structure.summary.edit', {
          structureId : data.id
        });
      });
    } else {
      ArchObj.createStructure(data).then(function() {
        $state.go('structure.summary', {
          structureId : data.id
        });
      }).catch(function(error) {
        console.log('Failed to save', error);
        $state.go('structure.summary.edit', {
          structureId : data.id
        });
      });
    }
  };

  $scope.clearCompletionDate = function() {
    structure.completion = '';
  };

  $scope.cancel = function() {
    if (structure.id) {
      $state.go('structure.summary');
    } else {
      $state.go('structures.australian');
    }
  };
});