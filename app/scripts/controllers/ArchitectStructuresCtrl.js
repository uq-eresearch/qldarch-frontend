'use strict';

angular.module('qldarchApp').controller(
    'ArchitectStructuresCtrl',
    function($scope, $http, structures, GraphHelper, LayoutHelper, leafletData, BuildingTypologyMarkers) {
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
        leafletData.getMap().then(function(map) {
          var latlon = [];
          angular.forEach(structures, function(structure) {
            if (angular.isDefined(structure.lat) && angular.isDefined(structure.lng)) {
              var mkrIcon = {};
              if (angular.isDefined(structure.typology)) {
                mkrIcon = {
                  icon : BuildingTypologyMarkers[structure.typology]
                };
              }
              var mkr = [ structure.lat, structure.lng ];
              var mkrPopup = '<a href="#/project/summary?structureId=' + structure.structureId + '">' + structure.structurelabel + '</a>';
              L.marker(mkr, mkrIcon).bindPopup(mkrPopup).addTo(map);
              latlon.push(mkr);
            }
          });
          map.fitBounds(new L.LatLngBounds(latlon));
        });
      }

      function addLegend() {
        console.log(BuildingTypologyMarkers);
        leafletData.getMap().then(
            function(map) {
              var legend = L.control({
                position : 'bottomleft'
              });
              legend.onAdd = function() {
                var div = L.DomUtil.create('div', 'legend');
                for ( var key in BuildingTypologyMarkers) {
                  div.innerHTML += '<div class="outline"><i class="fa fa-' + BuildingTypologyMarkers[key].options.icon + '" style="color:' +
                      BuildingTypologyMarkers[key].options.iconColor + ';background:' + BuildingTypologyMarkers[key].options.markerColor +
                      '"></i></div>' + key + '<br>';
                }
                return div;
              };
              legend.addTo(map);
            });
      }

      $scope.$watch('isShowingMap', function(isShowingMap) {
        if (isShowingMap) {
          addMarkers();
          addLegend();
        }
      });

    });