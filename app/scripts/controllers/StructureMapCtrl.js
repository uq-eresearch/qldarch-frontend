'use strict';

angular.module('qldarchApp').controller('StructureMapCtrl', function($scope, lat, lon, leafletData) {
  /* globals L:false */
  $scope.markers = {
    0 : {
      lat : lat,
      lng : lon
    }
  };

  leafletData.getMap().then(function(map) {
    map.fitBounds(new L.LatLngBounds([ [ lat, lon ] ]));
  });

});