'use strict';

angular.module('qldarchApp').controller(
    'ArchitectStructuresCtrl',
    function($scope, $http, structures, GraphHelper, LayoutHelper, leafletData) {
      /* globals L:false */
      $scope.structureRows = LayoutHelper.group(GraphHelper.graphValues(structures), 6);

      $scope.isShowingMap = function() {
        var hasmap = false;
        angular.forEach(structures, function(structure) {
          if (angular.isDefined(structure.lat) && angular.isDefined(structure.lng)) {
            hasmap = true;
          }
        });
        return hasmap;
      };

      function addMarkers() {
        leafletData.getMap().then(
            function(map) {
              var latlon = [];
              angular.forEach(structures, function(structure) {
                if (angular.isDefined(structure.lat) && angular.isDefined(structure.lng)) {
                  var mkr = [ structure.lat, structure.lng ];
                  L.marker(mkr).bindPopup(
                      '<a href="#/project/summary?structureId=' + structure.structureId + '">' + structure.structurelabel + '</a>').addTo(map);
                  latlon.push(mkr);
                }
              });
              map.fitBounds(new L.LatLngBounds(latlon));
            });
      }

      $scope.$watch('isShowingMap', function(isShowingMap) {
        if (isShowingMap) {
          addMarkers();
        }
      });

    });