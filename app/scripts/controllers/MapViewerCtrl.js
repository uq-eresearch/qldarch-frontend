'use strict';

angular.module('qldarchApp').controller('MapViewerCtrl', function($scope, compobj, CompObj, $state, Auth, leafletData) {
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
      var latlon = [];
      angular.forEach($scope.map.locations, function(structure) {
        if (angular.isDefined(structure.longitude) && angular.isDefined(structure.longitude)) {
          var mkr = [ structure.latitude, structure.longitude ];
          L.marker(mkr).bindPopup('<a href="#/project/summary?structureId=' + structure.id + '">' + structure.label + '</a>').addTo(map);
          latlon.push(mkr);
        }
      });
      map.fitBounds(new L.LatLngBounds(latlon));
    });
  }

  $scope.$watch('map.locations', function() {
    addMarkers();
  });

});