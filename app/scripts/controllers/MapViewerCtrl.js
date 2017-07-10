'use strict';

angular.module('qldarchApp').controller(
    'MapViewerCtrl',
    function($scope, compobj, CompObj, $state, Auth) {

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

      // Setup the map
      $scope.mapOptions = {
        zoom : 15,
        maxZoom : 16,
        mapTypeId : google.maps.MapTypeId.ROADMAP,
        scrollwheel : true
      };

      $scope.$watch('myMap', function(myMap) {
        if (myMap) {
          var bounds = new google.maps.LatLngBounds();
          var latlng = new google.maps.LatLng(-27.4698, 153.0251);// Brisbane
          bounds.extend(latlng);
          var latlng2 = new google.maps.LatLng(-16.9186, 145.7781);// Cairns
          bounds.extend(latlng2);
          myMap.fitBounds(bounds);
        }
      });

      /**
       * Creates a marker and adds it to the map. The marker color will be red
       * or blue, if added or temporary respectively.
       * 
       * @param {[type]}
       *          location The location object used to create the marker
       * @param {String}
       *          type Either 'added' or 'prospective'
       */
      function addMarkerToMapFromLocationWithType(location, type) {
        // Create marker position
        var position = new google.maps.LatLng(location.latitude, location.longitude);

        var animation = null, pinColor = 'CCCCCC';

        if (type === 'added') {
          pinColor = '11c3b6';
        } else if (type === 'prospective') {
          pinColor = 'FFFFFF';
          animation = google.maps.Animation.DROP;
        }

        // Use color to make marker image
        var pinImage = new google.maps.MarkerImage('https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|' + pinColor,
            new google.maps.Size(21, 34), new google.maps.Point(0, 0), new google.maps.Point(10, 34));

        // Create a marker
        var marker = new google.maps.Marker({
          position : position,
          title : location.label,
          icon : pinImage,
        });

        // Add the marker to the map
        marker.setMap($scope.myMap);
        // Store it for later
        $scope.map.$markers.push(marker);

        var infowindow;
        if (location.type === 'structure') {
          infowindow = new google.maps.InfoWindow({
            content : '<a href="#/project/summary?structureId=' + location.id + '">' + location.label + '</a>'
          });
        } else {
          infowindow = new google.maps.InfoWindow({
            content : '<span style="color:black">' + location.label + '</span>'
          });
        }

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open($scope.myMap, marker);
        });
      }

      function renderLocations(addedLocations, prospectiveLocations) {
        if (!angular.isDefined($scope.map.$markers)) {
          $scope.map.$markers = [];
        }
        setTimeout(function() {
          google.maps.event.trigger($scope.myMap, 'resize');

          setTimeout(function() {
            // Kill all existing markers
            angular.forEach($scope.map.$markers, function(marker) {
              marker.setMap(null);
            });
            $scope.map.$markers = [];

            // Add in new markers
            var hasLatLon = false;
            if (angular.isDefined(prospectiveLocations)) {
              angular.forEach(prospectiveLocations, function(p) {
                if (angular.isDefined(p.latitude) && angular.isDefined(p.longitude)) {
                  hasLatLon = true;
                }
              });
            }
            if (angular.isDefined(addedLocations)) {
              angular.forEach(addedLocations, function(a) {
                if (angular.isDefined(a.latitude) && angular.isDefined(a.longitude)) {
                  hasLatLon = true;
                }
              });
            }
            if (hasLatLon) {
              angular.forEach(prospectiveLocations, function(prospectiveLocation) {
                addMarkerToMapFromLocationWithType(prospectiveLocation, 'prospective');
              });
              angular.forEach(addedLocations, function(addedLocation) {
                addMarkerToMapFromLocationWithType(addedLocation, 'added');
              });
              // Expand the map to fit the marker
              var bounds = new google.maps.LatLngBounds();
              angular.forEach($scope.map.$markers, function(marker) {
                bounds.extend(marker.position);
              });
              $scope.myMap.fitBounds(bounds);
            }
          }, 0);
        }, 0);
      }

      $scope.$watchCollection('map.$import.prospectiveLocations', function(prospectiveLocations) {
        renderLocations($scope.map.locations, prospectiveLocations);
      });

      $scope.$watchCollection('map.locations', function(locations) {
        if (angular.isDefined($scope.map.$import)) {
          renderLocations(locations, $scope.map.$import.prospectiveLocations);
        }
      });

      $scope.$watch('zoom', function(zoom) {
        if (zoom) {
          var bounds;
          if (zoom === 'prospective') {
            bounds = new google.maps.LatLngBounds();
            angular.forEach($scope.map.$import.prospectiveLocations, function(prospectiveLocation) {
              bounds.extend(new google.maps.LatLng(prospectiveLocation.latitude, prospectiveLocation.longitude));
            });
            $scope.myMap.fitBounds(bounds);
          } else if (zoom === 'all') {
            bounds = new google.maps.LatLngBounds();
            angular.forEach($scope.map.$import.prospectiveLocations, function(prospectiveLocation) {
              bounds.extend(new google.maps.LatLng(prospectiveLocation.latitude, prospectiveLocation.longitude));
            });
            angular.forEach($scope.map.locations, function(location) {
              bounds.extend(new google.maps.LatLng(location.latitude, location.longitude));
            });
            $scope.myMap.fitBounds(bounds);
          } else if (zoom === 'added') {
            bounds = new google.maps.LatLngBounds();
            angular.forEach($scope.map.locations, function(location) {
              bounds.extend(new google.maps.LatLng(location.latitude, location.longitude));
            });
            $scope.myMap.fitBounds(bounds);
          }
        }
      });
    });