'use strict';

angular.module('angularApp')
    .controller('MapViewerCtrl', function ($scope, compoundObject) {
        $scope.compoundObject = compoundObject.jsonData;
        $scope.map = compoundObject.jsonData.data;

        // Setup the map
        $scope.mapOptions = {
            zoom: 15,
            maxZoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $scope.$watch('myMap', function (myMap) {
            console.log('is showing map', $scope.isShowingMap);
            if (myMap) {
                console.log('we have a map', myMap);
                var bounds = new google.maps.LatLngBounds();
                var latlng = new google.maps.LatLng(18.547324589827422, -72.388916015625);
                bounds.extend(latlng);
                myMap.fitBounds(bounds);
            }
        });

        $scope.$watchCollection('map.locations', function (locations) {
            if (!angular.isDefined($scope.map.$markers)) {
                $scope.map.$markers = [];
            }
            setTimeout(function () {
                google.maps.event.trigger($scope.myMap, 'resize');

                setTimeout(function () {
                    // Kill all existing markers
                    angular.forEach($scope.map.$markers, function (marker) {
                        marker.setMap(null);
                    });
                    $scope.map.$markers = [];

                    // Add in new markers
                    angular.forEach(locations, function (location) {
                        // Create a map marker
                        var position = new google.maps.LatLng(location.lat, location.lon);
                        // Create a marker
                        var marker = new google.maps.Marker({
                            position: position,
                            title: location.name,
                            animation: google.maps.Animation.DROP
                        });
                        // Add the marker to the map
                        marker.setMap($scope.myMap);
                        // Store it for later
                        $scope.map.$markers.push(marker);


                        var infowindow;
                        if (location.type === 'structure') {
                            infowindow = new google.maps.InfoWindow({
                                content: '<a href="#/project/summary?structureId=' + btoa(location.uri) + '">' + location.name + '</a>'
                            });
                        } else {
                            infowindow = new google.maps.InfoWindow({
                                content: location.name
                            });
                        }

                        google.maps.event.addListener(marker, 'click', function () {
                            infowindow.open($scope.myMap, marker);
                        });
                    });
                    // Expand the map to fit the marker
                    var bounds = new google.maps.LatLngBounds();
                    angular.forEach($scope.map.locations, function (location) {
                        bounds.extend(new google.maps.LatLng(location.lat, location.lon));
                    });
                    $scope.myMap.fitBounds(bounds);
                });
            });
        });
    });