'use strict';

angular.module('angularApp')
    .controller('StructureCtrl', function ($scope, structure, designers, Entity, $state, Uris) {
        $scope.structure = structure;
        $scope.designers = designers;
        console.log('structure', structure);


        $scope.updateStructure = function (structure) {
            if (structure.uri) {
                // PUT
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
                    structureId: structure.encodedUri
                });
            } else {
                // POST
                Entity.create(structure, Uris.QA_STRUCTURE_TYPE).then(function (structure) {
                    console.log('sturcture', structure);
                    $state.go('structure.summary', {
                        structureId: structure.encodedUri
                    });
                });
            }
        };

        $scope.cancel = function () {
            if (structure.uri) {
                $state.go('structure.summary');
            } else {
                $state.go('structure.australian');
            }
        };


        /**
         * ======================================================
         *
         * Select Box for Typologies
         *
         * ======================================================
         */
        // Setup the entity select boxes
        $scope.structure.$typology = null;
        angular.forEach(structure.buildingTypologies, function (typology) {
            $scope.structure.$typology = {
                id: typology.uri,
                uri: typology.uri,
                text: typology[Uris.QA_LABEL],
                name: typology[Uris.QA_LABEL],
                encodedUri: typology.encodedUri,
            };
        });
        $scope.$watch('structure.$typology', function (typology) {
            // Delete all typologies on the structure
            if (typology) {
                console.log('typologies changed');
                structure[Uris.QA_BUILDING_TYPOLOGY_P] = typology.uri;
            }
        });
        $scope.typologySelect = {
            placeholder: 'Select a Building Typology',
            dropdownAutoWidth: true,
            multiple: false,
            query: function (options) {
                Entity.loadAll('qldarch:BuildingTypology', true).then(function (typologies) {
                    var data = {
                        results: []
                    };

                    angular.forEach(typologies, function (typology) {
                        data.results.push({
                            id: typology.uri,
                            uri: typology.uri,
                            text: typology[Uris.QA_LABEL],
                            name: typology[Uris.QA_LABEL],
                            encodedUri: typology.encodedUri,
                        });
                    });
                    options.callback(data);
                });
            }
        };
        // $scope.$watch('structure.$typology.uri', function (uri) {
        //     if (uri) {
        //         structure[Uris.QA_BUILDING_TYPOLOGY_P] = uri;
        //     }
        // });


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