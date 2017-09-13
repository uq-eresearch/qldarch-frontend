'use strict';

angular.module('qldarchApp').controller('RelationshipsCreateCtrl',
    function($scope, $http, Uris, toaster, types, $filter, structures, architectsFirms, $state, $stateParams, CreateRelationship) {

      $scope.relationship = {};

      var relationshiptypes = {
        results : []
      };

      for ( var type in types) {
        if (type === 'WorkedOn') {
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

      $scope.relationship.$type = {
        id : 'WorkedOn',
        text : 'worked on'
      };

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

      $scope.subjSelect = {
        placeholder : 'Select an Architect or a Firm',
        dropdownAutoWidth : true,
        multiple : false,
        data : architectsFirmsSelect
      };

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

      $scope.objSelect = {
        placeholder : 'Select a Project',
        dropdownAutoWidth : true,
        multiple : false,
        data : structuresSelect
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
          goToRelationships($stateParams.archobjId, $stateParams.archobjType);
        });
      };

      $scope.cancel = function() {
        goToRelationships($stateParams.archobjId, $stateParams.archobjType);
      };
    });