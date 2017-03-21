'use strict';

angular.module('qldarchApp').controller('StructureCtrl',
    function($scope, structure, designers, ArchObj, firms, architects, $filter, BuildingTypologies, $state) {
      $scope.structure = structure;
      $scope.designers = designers;

      firms = $filter('orderBy')(firms, function(firm) {
        return firm.label;
      });

      architects = $filter('orderBy')(architects, function(architect) {
        return architect.label;
      });

      $scope.structure.type = 'structure';

      if (angular.isDefined(designers.firms[0])) {
        $scope.structure.$associatedFirm = {
          id : designers.firms[0].subject,
          text : designers.firms[0].subjectlabel
        };
      } else {
        $scope.structure.$associatedFirm = null;
      }

      $scope.firmSelect = {
        placeholder : 'Select a Firm',
        dropdownAutoWidth : true,
        multiple : false,
        allowClear : true,
        query : function(options) {
          var data = {
            results : []
          };
          angular.forEach(firms, function(firm) {
            data.results.push({
              id : firm.id,
              text : firm.label
            });
          });
          options.callback(data);
        }
      };

      $scope.structure.$associatedArchitects = null;
      if (angular.isDefined(designers.architects)) {
        $scope.structure.$associatedArchitects = [];
        angular.forEach(designers.architects, function(architect) {
          $scope.structure.$associatedArchitects.push({
            id : architect.subject,
            text : architect.subjectlabel
          });
        });
      }

      $scope.architectSelect = {
        placeholder : 'Select an Architect',
        dropdownAutoWidth : true,
        multiple : true,
        query : function(options) {
          var data = {
            results : []
          };
          angular.forEach(architects, function(architect) {
            data.results.push({
              id : architect.id,
              text : architect.label
            });
          });
          options.callback(data);
        }
      };

      $scope.structure.$typologies = null;
      if (angular.isDefined(structure.typologies)) {
        $scope.structure.$typologies = [];
        angular.forEach(structure.typologies, function(typo) {
          for ( var typology in BuildingTypologies) {
            if (typo === BuildingTypologies[typology]) {
              $scope.structure.$typologies.push({
                id : typology,
                text : BuildingTypologies[typology]
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
          for ( var typology in BuildingTypologies) {
            data.results.push({
              id : typology,
              text : BuildingTypologies[typology]
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