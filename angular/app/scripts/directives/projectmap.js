'use strict';

angular.module('angularApp')
    .directive('projectMap', function () {
        return {
            template: '<div style="margin-bottom: 20px;" ng-show="markers.length"><div class="map"></div></div>',
            restrict: 'E',
            replace: true,
            scope: {
                structures: '='
            },
            link: function postLink(scope, element) {
                var DEFAULT_HEIGHT = '600px';
                scope.markers = [];

                var mapOptions = {
                    zoom: 8,
                    center: new google.maps.LatLng(-34.397, 150.644),
                    scrollwheel: false
                };
                console.log('making a new map');
                // bounds.extend(latlng);

                var $map = element.find('.map');
                $map.css('height', DEFAULT_HEIGHT);

                // Create a map
                var map = new google.maps.Map($map.get(0),
                    mapOptions);

                scope.$watch('structures', function (structures) {
                    if (structures) {
                        // Remove all markers
                        angular.forEach(scope.markers, function (marker) {
                            marker.setMap(null);
                        });
                        scope.markers = [];

                        // Get a bounds ready
                        var bounds = new google.maps.LatLngBounds();

                        // Create new markers
                        angular.forEach(structures, function (structure) {
                            if (angular.isDefined(structure.lat)) {
                                // Lat lon
                                var position = new google.maps.LatLng(structure.lat, structure.lon);
                                // Create a marker
                                var marker = new google.maps.Marker({
                                    position: position,
                                    title: structures.name,
                                    animation: google.maps.Animation.DROP
                                });
                                // Add the marker to the map
                                marker.setMap(map);
                                // Expand the map to fit the marker
                                bounds.extend(position);
                                // Store the marker
                                scope.markers.push(marker);

                                // Create an info window
                                var infowindow = new google.maps.InfoWindow({
                                    content: '<a href="#/project/' + structure.encodedUri + '">' + structure.name + '</a>'
                                });

                                google.maps.event.addListener(marker, 'click', function () {
                                    infowindow.open(map, marker);
                                });
                            }
                        });
                        console.log('bounds', bounds);
                        setTimeout(function () {
                            map.fitBounds(bounds);
                        }, 0);
                    }
                });

                // To add the marker to the map, use the 'map' property
                // var image = 'images/beachflag.png';


                // element.css('height', '300px').css('width', '100%').css('border', '10px solid green');

                // Remvoe a marker
                // marker.setMap(null);

                // Set a markers map after creation
                // marker.setMap(map);
            }
        };
    });