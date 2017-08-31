'use strict';

angular.module('qldarchApp').controller(
    'MapViewerCtrl',
    function($scope, compobj, CompObj, $state, Auth, leafletData, BuildingTypologyMarkers) {
      /* globals L:false */
      $scope.compoundObject = compobj;
      $scope.map = compobj;
      $scope.map.$import = {};

      if (angular.isDefined(Auth.user) && angular.isDefined($scope.compoundObject.user)) {
        $scope.isDeletable = Auth.success && ($scope.compoundObject.user.displayName === Auth.user.displayName || Auth.user.role === 'admin');
      }

      $scope.delete = function() {
        var r = window.confirm('Delete this map?');
        if (r === true) {
          CompObj.delete(compobj.id).then(function() {
            $state.go('main');
          });
        }
      };

      // Fit map to QLD
      leafletData.getMap().then(function(map) {
        var latlon = [ [ -27.4698, 153.0251 ], [ -16.9186, 145.7781 ] ];/* Brisbane,Cairns */
        map.fitBounds(new L.LatLngBounds(latlon));
      });

      function addMarkers() {
        leafletData.getMap().then(function(map) {
          var markers = L.markerClusterGroup();
          var latlon = [];
          angular.forEach($scope.map.locations, function(structure) {
            if (angular.isDefined(structure.longitude) && angular.isDefined(structure.longitude)) {
              var mkrIcon = {};
              if (angular.isDefined(structure.typologies[0])) {
                mkrIcon = {
                  icon : BuildingTypologyMarkers[structure.typologies[0]]
                };
              }
              var mkr = [ structure.latitude, structure.longitude ];
              var mkrPopup = '<a href="/project/summary?structureId=' + structure.id + '">' + structure.label + '</a>';
              var marker = L.marker(mkr, mkrIcon).bindPopup(mkrPopup);
              markers.addLayer(marker);
              latlon.push(mkr);
            }
          });
          map.addLayer(markers);
          map.fitBounds(new L.LatLngBounds(latlon));
        });
      }

      function addLegend() {
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

      $scope.$watch('map.locations', function() {
        addMarkers();
        addLegend();
      });

    });