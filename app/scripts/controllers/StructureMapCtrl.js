'use strict';

angular.module('qldarchApp').controller('StructureMapCtrl', function($scope) {
  // Structure lat lon
  var position = new google.maps.LatLng($scope.structure.lat, $scope.structure.lon);
  $scope.myMarkers = [];

  $scope.mapOptions = {
    center : position,
    zoom : 15,
    mapTypeId : google.maps.MapTypeId.ROADMAP
  };
  $scope.mapEvents = {

  };

  $scope.$watch('myMap', function(myMap) {
    if (myMap) {
      google.maps.event.trigger($scope.myMap, 'resize');
      $scope.myMap.setCenter(position);
    }
  });

  $scope.addMarker = function($event, $params) {
    $scope.myMarkers.push(new google.maps.Marker({
      map : $scope.myMap,
      position : $params[0].latLng
    }));
  };

  $scope.setZoomMessage = function(zoom) {
    $scope.zoomMessage = 'You just zoomed to ' + zoom + '!';
    console.log(zoom, 'zoomed');
  };

  $scope.openMarkerInfo = function(marker) {
    $scope.currentMarker = marker;
    $scope.currentMarkerLat = marker.getPosition().lat();
    $scope.currentMarkerLng = marker.getPosition().lng();
    $scope.myInfoWindow.open($scope.myMap, marker);
  };

  $scope.setMarkerPosition = function(marker, lat, lng) {
    marker.setPosition(new google.maps.LatLng(lat, lng));
  };
});