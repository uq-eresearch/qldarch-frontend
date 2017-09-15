'use strict';

angular.module('qldarchApp').controller(
    'StructureCtrl',
    function($scope, structure, designers, ArchObj, firms, architects, $filter, buildingTypologies, $state, $q, $stateParams) {
      /* globals $:false */
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
      if (angular.isDefined($stateParams.firmId)) {
        $scope.structure.$associatedFirm = [];
        var firm = $.grep(firms, function(f) {
          return JSON.stringify(f.id) === $stateParams.firmId;
        });
        var firmobj = {
          id : firm[0].id,
          text : firm[0].label
        };
        $scope.structure.$associatedFirm.push(firmobj);
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
      if (angular.isDefined($stateParams.architectId)) {
        $scope.structure.$associatedArchitects = [];
        var architect = $.grep(architects, function(a) {
          return JSON.stringify(a.id) === $stateParams.architectId;
        });
        var architectobj = {
          id : architect[0].id,
          text : architect[0].label
        };
        $scope.structure.$associatedArchitects.push(architectobj);
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

      $scope.$watch('structure.location', function(location) {
        if (angular.isDefined(location)) {
          clearTimeout($scope.typingTimer);
          $scope.typingTimer = setTimeout(function() {
            $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address=' + $scope.structure.location,
                function(data) {
                  if (data.results.length === 1) {
                    if ((structure.latitude !== data.results[0].geometry.location.lat) ||
                        (structure.longitude !== data.results[0].geometry.location.lng)) {
                      structure.latitude = data.results[0].geometry.location.lat;
                      structure.longitude = data.results[0].geometry.location.lng;
                      $('#LAT').val(data.results[0].geometry.location.lat);
                      $('#LNG').val(data.results[0].geometry.location.lng);
                    }
                  }
                });
          }, 3000);
        }
      });

      $scope.updateStructure = function(data) {
        var promises = [];
        var promise;
        if (data.id) {
          promise = ArchObj.updateStructure(data).then(function(res) {
            return res;
          }).catch(function(error) {
            console.log('Failed to save', error);
            $state.go('structure.summary.edit', {
              structureId : data.id
            });
            return error;
          });
          promises.push(promise);
        } else {
          promise = ArchObj.createStructure(data).then(function(res) {
            return res;
          }).catch(function(error) {
            console.log('Failed to save', error);
            $state.go('structure.summary.edit', {
              structureId : data.id
            });
            return error;
          });
          promises.push(promise);
        }
        $q.all(promises).then(function() {
          if (angular.isDefined($stateParams.firmId)) {
            $state.go('firm.structures', {
              firmId : $stateParams.firmId
            }, {
              reload : true,
              inherit : false
            });
          } else if (angular.isDefined($stateParams.architectId)) {
            $state.go('architect.structures', {
              architectId : $stateParams.architectId
            }, {
              reload : true,
              inherit : false
            });
          } else if (structure.id) {
            $state.go('structure.summary', {
              structureId : data.id
            }, {
              reload : true,
              inherit : false
            });
          } else {
            $state.go('structures.australian');
          }
        });
      };

      $scope.clearCompletionDate = function() {
        structure.completion = '';
      };

      $scope.cancel = function() {
        if (structure.id) {
          $state.go('structure.summary');
        } else if (angular.isDefined($stateParams.firmId)) {
          $state.go('firm.structures', {
            firmId : $stateParams.firmId
          });
        } else if (angular.isDefined($stateParams.architectId)) {
          $state.go('architect.structures', {
            architectId : $stateParams.architectId
          });
        } else {
          $state.go('structures.australian');
        }
      };
    });
