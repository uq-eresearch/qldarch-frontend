'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('structure', {
    abstract : true,
    url : '/project?structureId',
    templateUrl : 'views/structure/layout.html',
    resolve : {
      structure : [ '$stateParams', 'ArchObj', function($stateParams, ArchObj) {
        if (!$stateParams.structureId) {
          return {};
        } else {      
          return ArchObj.loadWithRelationshipLabels($stateParams.structureId).then(function(data) {
            if (angular.isDefined(data.latitude) && angular.isDefined(data.longitude)) {
              data.lat = data.latitude;
              data.lon = data.longitude;
            }
            return data;
          }).catch(function() {
            console.log('unable to load structure ArchObj with relationship labels');
            return {};
          });
        }
      } ],
    },
    controller : [ '$scope', 'structure', function($scope, structure) {
      $scope.structure = structure;
      $scope.entity = structure;
    } ]
  });
});