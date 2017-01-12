'use strict';

angular.module('qldarchApp').controller('ArchitectStructuresCtrl', function($scope, structures, interviews, architect, GraphHelper, LayoutHelper) {

  $scope.structures = structures;
  $scope.structureRows = LayoutHelper.group(GraphHelper.graphValues(structures), 6);
  $scope.isShowingMap = false;

  // Setup the filters and map
  $scope.buildingTypologies = [];
  angular.forEach(structures, function(structure) {
    // We have some data to show on the map, so just set it to on
    if (angular.isDefined(structure.lat)) {
      console.log('show the map');
      $scope.isShowingMap = true;
    }

    // Extract all the unique building typologies
    angular.forEach(structure.buildingTypologies, function(buildingTypology) {
      var found = false;
      angular.forEach($scope.buildingTypologies, function(storedBuildingTypology) {
        if (buildingTypology.uri === storedBuildingTypology.uri) {
          found = true;
        }
      });

      if (!found) {
        $scope.buildingTypologies.push(buildingTypology);
      }
    });
  });

  // Setup the map
  $scope.mapOptions = {
    zoom : 15,
    maxZoom : 16,
    mapTypeId : google.maps.MapTypeId.ROADMAP
  };

  $scope.$watch('myMap', function(myMap) {
    console.log('is showing map', $scope.isShowingMap);
    if (myMap) {
      console.log('we have a map', myMap);
      var bounds = new google.maps.LatLngBounds();
      angular.forEach(structures, function(structure) {
        if (angular.isDefined(structure.lat)) {
          console.log('has a location', structure.lat);
          // Use the bounds
          var latlng = new google.maps.LatLng(structure.lat, structure.lon);
          bounds.extend(latlng);
        }
      });
      myMap.fitBounds(bounds);
    }
  });

});