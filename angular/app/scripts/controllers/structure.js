'use strict';

angular.module('angularApp')
    .controller('StructureCtrl', function ($scope, structure, types, designers, Entity, $state, Uris) {
        $scope.structure = structure;
        var originalStructure = angular.copy(structure);
        $scope.designers = designers;
        console.log('structure', structure);

        function goToTypePage(typeUri) {
            if (typeUri === Uris.QA_ARCHITECT_TYPE) {
                $state.go('architect.summary', {
                    architectId: structure.encodedUri
                });
            } else if (typeUri === Uris.QA_FIRM_TYPE) {
                $state.go('firm.summary', {
                    firmId: structure.encodedUri
                });
            } else if (typeUri === Uris.QA_STRUCTURE_TYPE) {
                $state.go('structure.summary', {
                    structureId: structure.encodedUri
                });
            } else {
                $state.go('other.summary', {
                    otherId: structure.encodedUri
                });
            }
        }

        $scope.clearCompletionDate = function () {
            // delete structure[Uris.QA_COMPLETION_DATE];
            structure[Uris.QA_COMPLETION_DATE] = '';
        };


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

                goToTypePage($scope.structure[Uris.RDF_TYPE]);
            } else {
                // POST
                Entity.create(structure, Uris.QA_STRUCTURE_TYPE).then(function (structure) {
                    console.log('structure', structure);
                    goToTypePage($scope.structure[Uris.RDF_TYPE]);
                });
            }
        };

        $scope.cancel = function () {
            if (structure.uri) {
                angular.copy(originalStructure, structure);
                $state.go('structure.summary');
            } else {
                $state.go('structures.australian');
            }
        };

        /**
         * ======================================================
         *
         * Select Box for Firms
         *
         * ======================================================
         */
        // Setup the entity select boxes
        $scope.$watch('structure.$associatedFirm', function (associatedFirm) {
            if (associatedFirm) {
                structure[Uris.QA_ASSOCIATED_FIRM] = associatedFirm.uri;
            } else {
                delete structure[Uris.QA_ASSOCIATED_FIRM];
            }
        });
        $scope.firmSelect = {
            placeholder: 'Select a Firm',
            dropdownAutoWidth: true,
            multiple: false,
            allowClear: true,
            query: function (options) {
                Entity.loadAll('qldarch:Firm', true).then(function (firms) {
                    var data = {
                        results: []
                    };

                    angular.forEach(firms, function (firm) {
                        if (firm.name.toLowerCase().indexOf(options.term.toLowerCase()) !== -1) {
                            data.results.push(firm);
                        }
                    });
                    options.callback(data);
                });
            }
        };


        /**
         * ======================================================
         *
         * Select Box for Architects
         *
         * ======================================================
         */
        // Setup the entity select boxes
        $scope.$watch('structure.$associatedArchitects', function (associatedArchitects) {
            if (associatedArchitects) {
                if (associatedArchitects.length) {
                    structure[Uris.QA_ASSOCIATED_ARCHITECT] = [];
                    angular.forEach(associatedArchitects, function (associatedArchitect) {
                        structure[Uris.QA_ASSOCIATED_ARCHITECT].push(associatedArchitect.uri);
                    });
                } else {
                    delete structure[Uris.QA_ASSOCIATED_ARCHITECT];
                }
            }
        });

        $scope.architectSelect = {
            placeholder: 'Select an Architect',
            dropdownAutoWidth: true,
            multiple: true,
            query: function (options) {
                Entity.loadAll('qldarch:Architect', true).then(function (architects) {
                    var data = {
                        results: []
                    };

                    angular.forEach(architects, function (architect) {
                        if (architect.name.toLowerCase().indexOf(options.term.toLowerCase()) !== -1) {
                            data.results.push(architect);
                        }
                    });
                    options.callback(data);
                });
            }
        };


        /**
         * ======================================================
         *
         * Select Box for Types
         *
         * ======================================================
         */
        $scope.structure.$type = null;
        angular.forEach(types, function (type) {
            if (type.uri === Uris.QA_STRUCTURE_TYPE) {
                $scope.structure.$type = {
                    id: type.uri,
                    uri: type.uri,
                    text: type[Uris.QA_LABEL],
                    name: type[Uris.QA_LABEL],
                    encodedUri: type.encodedUri,
                };
            }
        });
        $scope.$watch('structure.$type', function (type) {
            // Delete all typologies on the structure
            if (type) {
                $scope.structure[Uris.RDF_TYPE] = type.uri;
            }
        });
        $scope.typeSelect = {
            placeholder: 'Select a Type',
            dropdownAutoWidth: true,
            multiple: false,
            query: function (options) {
                var data = {
                    results: []
                };
                angular.forEach(types, function (type) {
                    if (type.uri !== Uris.QA_BUILDING_TYPOLOGY && type[Uris.QA_LABEL].toLowerCase().indexOf(options.term.toLowerCase()) !== -1) {
                        data.results.push({
                            id: type.uri,
                            uri: type.uri,
                            text: type[Uris.QA_LABEL],
                            name: type[Uris.QA_LABEL],
                            encodedUri: type.encodedUri,
                        });
                    }
                });
                options.callback(data);
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
        $scope.$watch('structure.$typologies', function (typologies) {
            // Delete all typologies on the structure
            if (typologies) {
                if (typologies.length) {
                    structure[Uris.QA_BUILDING_TYPOLOGY_P] = [];
                    angular.forEach(typologies, function (typology) {
                        structure[Uris.QA_BUILDING_TYPOLOGY_P].push(typology.uri);
                    });
                } else {
                    delete structure[Uris.QA_BUILDING_TYPOLOGY_P];
                }
            }
        });
        $scope.typologySelect = {
            placeholder: 'Select a Building Typology',
            dropdownAutoWidth: true,
            multiple: true,
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