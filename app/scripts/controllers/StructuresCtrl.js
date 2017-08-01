'use strict';

angular.module('qldarchApp').controller(
    'StructuresCtrl',
    function($scope, structures, LayoutHelper, GraphHelper, leafletData, $stateParams, $location, $filter, $state, BuildingTypologyMarkers) {
      /* globals L:false */
      var DEFAULT_STRUCTURE_ROW_COUNT = 5;
      $scope.structureRowDisplayCount = DEFAULT_STRUCTURE_ROW_COUNT;

      $scope.$stateParams = $stateParams;
      $scope.indexes = {
        '#' : false,
        'A' : false,
        'B' : false,
        'C' : false,
        'D' : false,
        'E' : false,
        'F' : false,
        'G' : false,
        'H' : false,
        'I' : false,
        'J' : false,
        'K' : false,
        'L' : false,
        'M' : false,
        'N' : false,
        'O' : false,
        'P' : false,
        'Q' : false,
        'R' : false,
        'S' : false,
        'T' : false,
        'U' : false,
        'V' : false,
        'W' : false,
        'X' : false,
        'Y' : false,
        'Z' : false
      };

      function isLetter(char) {
        return char.match(/[a-z]/i);
      }

      $scope.structures = $filter('filter')(GraphHelper.graphValues(structures), function(structure) {
        var startLetter = structure.label.substring(0, 1).toUpperCase();
        if (!isNaN(startLetter)) {
          $scope.indexes['#'] = true;
        } else if (isLetter(startLetter)) {
          $scope.indexes[startLetter] = true;
        }
        if ($stateParams.index && $stateParams.index.length === 1) {
          if (!isNaN(startLetter) && '#' === $stateParams.index) {
            return true;
          } else if (isLetter($stateParams.index) && startLetter === $stateParams.index) {
            return true;
          }
          return false;
        }
        return true;
      });

      $scope.structures = $filter('orderBy')(GraphHelper.graphValues($scope.structures), function(structure) {
        return structure.label;
      });
      $scope.structureRows = LayoutHelper.group(GraphHelper.graphValues($scope.structures), 6);

      $scope.goToIndex = function(index) {
        $state.go($state.current.name, {
          index : index
        });
      };

      $scope.addMoreStructureRows = function() {
        $scope.structureRowDisplayCount += 5;
      };

      function addMarkers() {
        leafletData.getMap().then(function(map) {
          var latlon = [];
          angular.forEach($scope.structures, function(structure) {
            if (angular.isDefined(structure.lat) && angular.isDefined(structure.lng)) {
              var mkrIcon = {};
              if (angular.isDefined(structure.typology)) {
                mkrIcon = {
                  icon : BuildingTypologyMarkers[structure.typology]
                };
              }
              var mkr = [ structure.lat, structure.lng ];
              var mkrPopup = '<a href="#/project/summary?structureId=' + structure.id + '">' + structure.label + '</a>';
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

      $scope.$watch('structures', function() {
        addMarkers();
        addLegend();
      });

    });