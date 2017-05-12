'use strict';

angular.module('qldarchApp').controller('RelationshipsCreateCtrl',
    function($scope, $http, Uris, toaster, types, $filter, structures, architectsFirms, $state, $stateParams) {
      /* globals $:false */
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

      var createRelationship = function(data) {
        var payload = angular.copy(data);
        payload.source = 'structure';
        payload.type = payload.$type.id;
        payload.subject = payload.$subject.id;
        payload.object = payload.$object.id;
        delete payload.from;
        delete payload.until;
        if (payload.$from !== null && angular.isDefined(payload.$from) && payload.$from !== '') {
          payload.from = payload.$from.getFullYear();
        }
        if (payload.$until !== null && angular.isDefined(payload.$until) && payload.$until !== '') {
          payload.until = payload.$until.getFullYear();
        }
        // Remove any extra information
        delete payload.$source;
        delete payload.$type;
        delete payload.$subject;
        delete payload.$object;
        delete payload.$from;
        delete payload.$until;
        delete payload.id;
        delete payload.owner;
        delete payload.created;
        return $http({
          method : 'PUT',
          url : Uris.WS_ROOT + 'relationship',
          headers : {
            'Content-Type' : 'application/x-www-form-urlencoded'
          },
          withCredentials : true,
          transformRequest : function(obj) {
            return $.param(obj);
          },
          data : payload
        }).then(function(response) {
          angular.extend(data, response.data);
          toaster.pop('success', data.id + ' relationship created.');
          console.log('created relationship id:' + data.id);
          return data;
        }, function() {
          toaster.pop('error', 'Error occured.', 'Sorry, we save at this time');
        });
      };

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
        createRelationship(relationship).then(function() {
          goToRelationships($stateParams.archobjId, $stateParams.archobjType);
        });
      };

      $scope.cancel = function() {
        goToRelationships($stateParams.archobjId, $stateParams.archobjType);
      };

    });