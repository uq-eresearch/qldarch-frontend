'use strict';

angular.module('qldarchApp').directive('projectMap', function() {
  return {
    template : '<div style="margin-bottom: 20px;" ng-show="markers.length"><div class="map"></div></div>',
    restrict : 'E',
    replace : true,
    scope : {
      structures : '='
    },
    link : function postLink(scope, element) {
      var DEFAULT_HEIGHT = '400px';
      scope.markers = [];

      var mapOptions = {
        zoom : 8,
        center : new google.maps.LatLng(-34.397, 150.644),
        scrollwheel : false
      };
      console.log('making a new map');

      var $map = element.find('.map');
      $map.css('height', DEFAULT_HEIGHT);

      // Create a map
      var map = new google.maps.Map($map.get(0), mapOptions);

      scope.$watch('structures', function(structures) {
        if (structures) {
          // Remove all markers
          angular.forEach(scope.markers, function(marker) {
            marker.setMap(null);
          });
          scope.markers = [];

          // Get a bounds ready
          var bounds = new google.maps.LatLngBounds();

          // Create new markers
          angular.forEach(structures, function(structure) {
            if (angular.isDefined(structure.lat)) {
              // Lat lon
              var position = new google.maps.LatLng(structure.lat, structure.lon);
              // Label and id
              var infowindowlabel;
              var infowindowid;
              if (structure.label) {
                infowindowlabel = structure.label;
                infowindowid = structure.id;
              } else if (structure.structurelabel) {
                infowindowlabel = structure.structurelabel;
                if (structure.objecttype === 'structure') {
                  infowindowid = structure.object;
                } else if (structure.subjecttype === 'structure') {
                  infowindowid = structure.subject;
                }
              }
              // Create a marker
              var marker = new google.maps.Marker({
                position : position,
                title : infowindowlabel,
                animation : google.maps.Animation.DROP
              });
              // Add the marker to the map
              marker.setMap(map);
              // Expand the map to fit the marker
              bounds.extend(position);
              // Store the marker
              scope.markers.push(marker);

              // Create an info window
              var infowindow = new google.maps.InfoWindow({
                content : '<a href="#/project/summary?structureId=' + infowindowid + '">' + infowindowlabel + '</a>'
              });

              google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map, marker);
              });
            }
          });
          console.log('bounds', bounds);
          setTimeout(function() {
            map.fitBounds(bounds);
          }, 0);
        }
      });

    }
  };
});