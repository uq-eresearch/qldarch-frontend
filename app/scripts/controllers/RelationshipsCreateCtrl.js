'use strict';

angular.module('qldarchApp').controller('RelationshipsCreateCtrl',
    function($scope, $http, Uris, toaster, types, $filter, architects, firms, structures, architectsFirms, $state, $stateParams, CreateRelationship) {

      $scope.relationship = {};

      var relationshiptypes = {
        results : []
      };

      for ( var type in types) {
        if ($stateParams.type === 'firm' && type === 'Employment') {
          relationshiptypes.results.push({
            id : type,
            text : types[type]
          });
        }
        if ($stateParams.type === 'structure' && type === 'WorkedOn') {
          relationshiptypes.results.push({
            id : type,
            text : types[type]
          });
        }
      }

      $scope.relationshiptypeSelect = {
        placeholder : 'Select a Relationship Type',
        dropdownAutoWidth : true,
        multiple : false,
        data : relationshiptypes
      };

      if ($stateParams.type === 'firm') {
        $scope.relationship.$type = {
          id : 'Employment',
          text : 'employed by'
        };
      }
      if ($stateParams.type === 'structure') {
        $scope.relationship.$type = {
          id : 'WorkedOn',
          text : 'worked on'
        };
      }

      architects = $filter('orderBy')(architects, function(architect) {
        return architect.label;
      });
      var architectsSelect = {
        results : []
      };
      angular.forEach(architects, function(architect) {
        architectsSelect.results.push({
          id : architect.id,
          text : architect.label + ' (Architect)'
        });
      });

      architectsFirms = $filter('orderBy')(architectsFirms, function(entity) {
        return entity.label;
      });
      var architectsFirmsSelect = {
        results : []
      };
      angular.forEach(architectsFirms, function(e) {
        if (e.label && !(/\s/.test(e.label.substring(0, 1)))) {
          var entitytype = 'unknown';
          if (e.hasOwnProperty('type')) {
            entitytype = e.type.charAt(0).toUpperCase() + e.type.slice(1);
          } else if (e.hasOwnProperty('firstname') || e.hasOwnProperty('lastname')) {
            entitytype = 'Architect';
          } else if (e.hasOwnProperty('lat') || e.hasOwnProperty('lng')) {
            entitytype = 'Project';
          }
          architectsFirmsSelect.results.push({
            id : e.id,
            text : e.label + ' (' + entitytype + ')'
          });
        }
      });

      var subjplaceholder;
      var subjdataselect;
      if ($stateParams.type === 'firm') {
        subjplaceholder = 'Select an Architect';
        subjdataselect = architectsSelect;
      } else {
        subjplaceholder = 'Select an Architect or a Firm';
        subjdataselect = architectsFirmsSelect;
      }

      $scope.subjSelect = {
        placeholder : subjplaceholder,
        dropdownAutoWidth : true,
        multiple : false,
        data : subjdataselect
      };

      firms = $filter('orderBy')(firms, function(firm) {
        return firm.label;
      });
      var firmsSelect = {
        results : []
      };
      angular.forEach(firms, function(firm) {
        firmsSelect.results.push({
          id : firm.id,
          text : firm.label + ' (Firm)'
        });
      });

      structures = $filter('orderBy')(structures, function(entity) {
        return entity.label;
      });
      var structuresSelect = {
        results : []
      };
      angular.forEach(structures, function(e) {
        if (e.label && !(/\s/.test(e.label.substring(0, 1)))) {
          var entitytype = 'unknown';
          if (e.hasOwnProperty('type')) {
            entitytype = e.type.charAt(0).toUpperCase() + e.type.slice(1);
          } else if (e.hasOwnProperty('firstname') || e.hasOwnProperty('lastname')) {
            entitytype = 'Architect';
          } else if (e.hasOwnProperty('lat') || e.hasOwnProperty('lng')) {
            entitytype = 'Project';
          }
          structuresSelect.results.push({
            id : e.id,
            text : e.label + ' (' + entitytype + ')'
          });
        }
      });

      var objplaceholder;
      var objdataselect;
      if ($stateParams.type === 'firm') {
        objplaceholder = 'Select a firm';
        objdataselect = firmsSelect;
      } else {
        objplaceholder = 'Select a Project';
        objdataselect = structuresSelect;
      }

      $scope.objSelect = {
        placeholder : objplaceholder,
        dropdownAutoWidth : true,
        multiple : false,
        data : objdataselect
      };

      $scope.relationship.$subject = null;
      $scope.relationship.$object = null;
      if ($stateParams.archobjType === 'structure') {
        angular.forEach(structures, function(structure) {
          if ($stateParams.archobjId === JSON.stringify(structure.id)) {
            $scope.relationship.$object = {
              id : structure.id,
              text : structure.label
            };
          }
        });
      } else if ($stateParams.type === 'firm' && $stateParams.archobjType === 'firm') {
        angular.forEach(firms, function(firm) {
          if ($stateParams.archobjId === JSON.stringify(firm.id)) {
            $scope.relationship.$object = {
              id : firm.id,
              text : firm.label
            };
          }
        });
      } else {
        angular.forEach(architectsFirms, function(entity) {
          if ($stateParams.archobjId === JSON.stringify(entity.id)) {
            $scope.relationship.$subject = {
              id : entity.id,
              text : entity.label
            };
          }
        });
      }

      function goToRelationships(archobjId, archobjType) {
        var params = {};
        if (archobjType === 'person') {
          params.architectId = archobjId;
          $state.go('architect.relationships', params);
        } else if (archobjType === 'firm') {
          params.firmId = archobjId;
          $state.go('firm.relationships', params);
        } else if (archobjType === 'structure') {
          params.structureId = archobjId;
          $state.go('structure.relationships', params);
        } else {
          params.otherId = archobjId;
          $state.go('other.relationships', params);
        }
      }

      $scope.createRelationship = function(relationship) {
        relationship.$source = 'structure';
        CreateRelationship.createRelationship(relationship).then(function() {
          toaster.pop('success', 'Relationship created');
          if ($stateParams.type === 'firm' && $stateParams.archobjType === 'firm') {
            $state.go('firm.employees', {
              firmId : $stateParams.archobjId
            });
          } else {
            goToRelationships($stateParams.archobjId, $stateParams.archobjType);
          }
        });
      };

      $scope.cancel = function() {
        if ($stateParams.type === 'firm' && $stateParams.archobjType === 'firm') {
          $state.go('firm.employees', {
            firmId : $stateParams.archobjId
          });
        } else {
          goToRelationships($stateParams.archobjId, $stateParams.archobjType);
        }
      };
    });