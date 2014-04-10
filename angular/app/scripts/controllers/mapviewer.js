'use strict';

angular.module('angularApp')
    .controller('MapViewerCtrl', function ($scope, compoundObject, CompoundObject, $state, Auth) {
        $scope.compoundObject = compoundObject.jsonData;
        $scope.map = compoundObject.jsonData.data;
        $scope.map.$import = {};

        $scope.isEditable = Auth.auth && ($scope.compoundObject.user.user === Auth.user || Auth.role === 'root');
        $scope.isDeletable = Auth.auth && ($scope.compoundObject.user.user === Auth.user || Auth.role === 'root');

        $scope.delete = function () {
            var r = window.confirm('Delete this map?');
            if (r === true) {
                CompoundObject.delete(compoundObject.uri).then(function (data) {
                    console.log('data is', data);
                    $state.go('main');
                });
            }
        };

        // Setup the map
        $scope.mapOptions = {
            zoom: 15,
            maxZoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false
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

        /**
         * Creates a marker and adds it to the map. The marker color will be red or blue, if added or temporary respectively.
         *
         * @param {[type]} location The location object used to create the marker
         * @param {String} type     Either 'added' or 'prospective'
         */
        function addMarkerToMapFromLocationWithType(location, type) {
            // Create marker position
            var position = new google.maps.LatLng(location.lat, location.lon);

            var animation = null,
                pinColor = 'CCCCCC';

            if (type === 'added') {
                pinColor = 'E42962';
            } else if (type === 'prospective') {
                pinColor = 'F0D1DA';
                animation = google.maps.Animation.DROP;
            }

            // Use color to make marker image
            var pinImage = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|' + pinColor,
                new google.maps.Size(21, 34),
                new google.maps.Point(0, 0),
                new google.maps.Point(10, 34));

            // Create a marker
            var marker = new google.maps.Marker({
                position: position,
                title: location.name,
                // animation: animation,
                icon: pinImage,
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
        }

        function renderLocations(addedLocations, prospectiveLocations) {
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
                    angular.forEach(prospectiveLocations, function (prospectiveLocation) {
                        addMarkerToMapFromLocationWithType(prospectiveLocation, 'prospective');
                    });
                    angular.forEach(addedLocations, function (addedLocation) {
                        addMarkerToMapFromLocationWithType(addedLocation, 'added');
                    });

                    // Expand the map to fit the marker
                    var bounds = new google.maps.LatLngBounds();
                    angular.forEach($scope.map.$markers, function (marker) {
                        bounds.extend(marker.position);
                    });
                    $scope.myMap.fitBounds(bounds);
                }, 0);
            }, 0);
        }

        $scope.$watchCollection('map.$import.prospectiveLocations', function (prospectiveLocations) {
            renderLocations($scope.map.locations, prospectiveLocations);
        });

        $scope.$watchCollection('map.locations', function (locations) {
            renderLocations(locations, $scope.map.$import.prospectiveLocations);
        });
    });