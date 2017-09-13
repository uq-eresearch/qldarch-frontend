'use strict';

angular.module('qldarchApp').controller('StructureCtrl',
    function($scope, structure, designers, ArchObj, firms, architects, $filter, buildingTypologies, $state) {
      $scope.structure = structure;
      $scope.designers = designers;

      firms = $filter('orderBy')(firms, function(firm) {
        return firm.label;
      });

      architects = $filter('orderBy')(architects, function(architect) {
        return architect.label;
      });

      $scope.structure.type = 'structure';

      $scope.structure.associatedEntities = [];

      $scope.structure.$associatedFirm = null;
      if (angular.isDefined(designers.firms)) {
        $scope.structure.$associatedFirm = [];
        angular.forEach(designers.firms, function(firm) {
          var firmobj = {
            id : firm.subject,
            text : firm.subjectlabel
          };
          $scope.structure.$associatedFirm.push(firmobj);
          firmobj.relationshipid = firm.relationshipid;
          $scope.structure.associatedEntities.push(firmobj);
        });
      }

      var dataFirmSelect = {
        results : []
      };

      angular.forEach(firms, function(firm) {
        dataFirmSelect.results.push({
          id : firm.id,
          text : firm.label
        });
      });

      $scope.firmSelect = {
        placeholder : 'Select a Firm',
        dropdownAutoWidth : true,
        multiple : true,
        allowClear : true,
        data : dataFirmSelect
      };

      $scope.structure.$associatedArchitects = null;
      if (angular.isDefined(designers.architects)) {
        $scope.structure.$associatedArchitects = [];
        angular.forEach(designers.architects, function(architect) {
          var architectobj = {
            id : architect.subject,
            text : architect.subjectlabel
          };
          $scope.structure.$associatedArchitects.push(architectobj);
          architectobj.relationshipid = architect.relationshipid;
          $scope.structure.associatedEntities.push(architectobj);
        });
      }

      var dataArchitectSelect = {
        results : []
      };

      angular.forEach(architects, function(architect) {
        dataArchitectSelect.results.push({
          id : architect.id,
          text : architect.label
        });
      });

      $scope.architectSelect = {
        placeholder : 'Select an Architect',
        dropdownAutoWidth : true,
        multiple : true,
        data : dataArchitectSelect
      };

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
              reload : true,
              inherit : false
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
            }, {
              reload : true,
              inherit : false
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