'use strict';

angular.module('angularApp')
    .controller('ArchitectStructuresCtrl', function ($scope, structures, interviews, architect, GraphHelper, LayoutHelper) {
        $scope.structures = structures;
        $scope.structureRows = LayoutHelper.group(GraphHelper.graphValues(structures), 6);
        $scope.interviews = interviews;
        $scope.architect = architect;
        $scope.isShowingMap = false;

        // Setup the filters and map
        console.log('structures', structures);
        $scope.buildingTypologies = [];
        angular.forEach(structures, function (structure) {
            // We have some data to show on the map, so just set it to on
            if (angular.isDefined(structure.lat)) {
                console.log('show the map');
                $scope.isShowingMap = true;
            }

            // Extract all the unique building typologies
            angular.forEach(structure.buildingTypologies, function (buildingTypology) {
                var found = false;
                angular.forEach($scope.buildingTypologies, function (storedBuildingTypology) {
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
            zoom: 15,
            maxZoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $scope.$watch('myMap', function (myMap) {
            console.log('is showing map', $scope.isShowingMap);
            if (myMap) {
                console.log('we have a map', myMap);
                var bounds = new google.maps.LatLngBounds();
                angular.forEach(structures, function (structure) {
                    if (angular.isDefined(structure.lat)) {
                        // Create a marker
                        console.log('has a location', structure.lat);
                        var marker = new google.maps.Marker({
                            position: new google.maps.LatLng(structure.lat, structure.lon),
                            title: structure.name,
                            map: $scope.myMap
                        });

                        // Use the bounds
                        var latlng = new google.maps.LatLng(structure.lat, structure.lon);
                        bounds.extend(latlng);
                    }
                });
                myMap.fitBounds(bounds);
            }
        });


        // var listener = google.maps.event.addListener(map, "idle", function() { 
        //   if (map.getZoom() > 16) map.setZoom(16); 
        //   google.maps.event.removeListener(listener); 
        // });



        // $scope.explore = function() {
        // 	$location.path("/explore");
        // 	$location.search("uri", GraphHelper.encodeUriString($scope.architect.uri));
        // }


        // var position = new google.maps.LatLng(-27.47101069974658, 153.02344889903907);

        // 
        // $scope.mapEvents = {

        // };

        // $scope.refreshMap = function() {
        // 	console.log("map tab clicked");
        // 	google.maps.event.trigger($scope.myMap, 'resize');
        // 	$scope.myMap.setCenter(position);

        // 	angular.forEach(structures, function(structure) {
        // 		console.log("structure", structure);
        // 		if(angular.isDefined(structure.lat)) {
        // 			var marker = new google.maps.Marker({
        // 				position: new google.maps.LatLng(structure.lat, structure.lon),
        // 				title: structure.name,
        // 				map: $scope.myMap
        // 			});
        // 		}
        // 	});
        //			if(!marker) {
        //				marker = new google.maps.Marker({
        //					position: position,
        //					title: $scope.structure.name,
        //					map: $scope.myMap
        //				});
        //			}
    });