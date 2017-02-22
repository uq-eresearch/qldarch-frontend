'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('structure', {
    abstract: true,
    url: '/project?structureId',
    templateUrl: 'views/structure/layout.html',
    resolve: {
      structure: ['$stateParams', '$http', 'Uris', 'Relationshiplabels', function($stateParams, $http, Uris, Relationshiplabels) {
        if (!$stateParams.structureId) {
          return {};
        } else {
          return $http.get(Uris.WS_ROOT + 'archobj/' + $stateParams.structureId).then(function(result) {
            angular.forEach(result.data.relationships, function(relationship) {
              if (Relationshiplabels.hasOwnProperty(relationship.relationship)) {
                relationship.relationship = Relationshiplabels[relationship.relationship];
              }
            });
            if (result.data.latitude) {
              result.data.lat = result.data.latitude;
            }
            if (result.data.longitude) {
              result.data.lon = result.data.longitude;
            }
            return result.data;
          });
        }
      }],
    },
    controller: ['$scope', 'structure', 'Entity', '$state',function($scope, structure, Entity, $state) {
      $scope.structure = structure;
      $scope.entity = structure;

      $scope.delete = function(structure) {
        var r = window.confirm('Delete project ' + structure.name + '?');
        if (r === true) {
          Entity.delete(structure.uri).then(function() {
            $state.go('structures.australian');
          });
        }
      };
    }]
  });
});