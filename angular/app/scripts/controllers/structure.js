'use strict';

angular.module('angularApp')
    .controller('StructureCtrl', function ($scope, structure, designers, Entity, $state, Uris) {
        $scope.structure = structure;
        $scope.designers = designers;


        $scope.updateStructure = function (structure) {
            Entity.update(structure.uri, structure).then(function () {
                // Set the location stuff again
                if (angular.isDefined(structure[Uris.QA_LOCATION])) {
                    structure.locations = [structure[Uris.QA_LOCATION]];
                }
            }, function (reason) {
                alert('Failed to save');
                console.log('Failed to save', reason);
                $state.go('structure.summary.edit', {
                    structureId: structure.encodedUri
                });
            });

            $state.go('structure.summary', {
                structure: structure.encodedUri
            });
        };


        // $scope.structure = structure;
        // $scope.photographRows = LayoutHelper.group(photographs, 6);
        // $scope.designers = GraphHelper.graphValues(designers);
        // $scope.designerRows = LayoutHelper.group(GraphHelper.graphValues(designers), 6);

        // Structure lat lon
        // var position = new google.maps.LatLng($scope.structure.lat, $scope.structure.lon);
        // var marker;
        // $scope.myMarkers = [];

        // $scope.mapOptions = {
        //     center: position,
        //     zoom: 15,
        //     mapTypeId: google.maps.MapTypeId.ROADMAP
        // };
        // $scope.mapEvents = {

        // };

        // $scope.refreshMap = function () {
        //     google.maps.event.trigger($scope.myMap, 'resize');
        //     $scope.myMap.setCenter(position)
        //     if (!marker) {
        //         marker = new google.maps.Marker({
        //             position: position,
        //             title: $scope.structure.name,
        //             map: $scope.myMap
        //         });
        //     }
        // };

        // $scope.addMarker = function ($event, $params) {
        //     $scope.myMarkers.push(new google.maps.Marker({
        //         map: $scope.myMap,
        //         position: $params[0].latLng
        //     }));
        // };

        // $scope.setZoomMessage = function (zoom) {
        //     $scope.zoomMessage = 'You just zoomed to ' + zoom + '!';
        //     console.log(zoom, 'zoomed');
        // };

        // $scope.openMarkerInfo = function (marker) {
        //     $scope.currentMarker = marker;
        //     $scope.currentMarkerLat = marker.getPosition().lat();
        //     $scope.currentMarkerLng = marker.getPosition().lng();
        //     $scope.myInfoWindow.open($scope.myMap, marker);
        // };

        // $scope.setMarkerPosition = function (marker, lat, lng) {
        //     marker.setPosition(new google.maps.LatLng(lat, lng));
        // };
    });