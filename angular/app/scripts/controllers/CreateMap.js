'use strict';

angular.module('angularApp')
    .controller('CreateMapCtrl', function ($scope, Entity) {
        console.log('map ctrl?');
        $scope.map = {
            locations: [],
            $markers: []
        };

        $scope.import = {};
        $scope.location = {};

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

        /*
        =====================================================
            Select2 Boxes
        =====================================================
         */
        // Setup the entity select boxes
        $scope.architectStructureFirmTypologySelect = {
            placeholder: 'Architect, Project, Firm or Typology',
            dropdownAutoWidth: true,
            multiple: false,
            // minimumInputLength: 2,
            query: function (options) {
                Entity.findByName(options.term, false).then(function (entities) {
                    var data = {
                        results: []
                    };

                    angular.forEach(entities, function (entity) {
                        if (entity.type === 'architect' || entity.type === 'buildingtypology' || entity.type === 'firm' || entity.type === 'structure') {

                            var label = entity.name + ' (' + entity.type.charAt(0).toUpperCase() + entity.type.slice(1) + ')';
                            if (entity.type === 'buildingtypology') {
                                label = entity.name + ' (Building typology)';
                            }
                            if (entity.type === 'structure') {
                                label = entity.name + ' (Project)';
                            }
                            data.results.push({
                                id: entity.uri,
                                uri: entity.uri,
                                text: label,
                                type: entity.type,
                                name: entity.name,
                                encodedUri: entity.encodedUri,
                                picture: entity.picture
                            });
                        }

                    });
                    options.callback(data);
                });
            }
        };

        /*
        =====================================================
            Import Places
        =====================================================
         */
        // $scope.$watch('import.entity', function (entity) {
        //     if (!entity) {
        //         return;
        //     }
        //     $scope.import.numberToImport = 0;

        //     Relationship.findByEntityUri(entity.uri).then(function (relationships) {
        //         var relationshipsWithDates = $filter('filter')(relationships, function (relationship) {
        //             return angular.isDefined(relationship[Uris.QA_START_DATE]);
        //         });
        //         return Relationship.getData(relationshipsWithDates);
        //     }).then(function (data) {
        //         var relationships = data.relationships;
        //         // Convert the relationships to dates
        //         var importDates = Timeline.relationshipsToEvents(relationships, entity);
        //         // Set all the dates as selected
        //         angular.forEach(importDates, function (importDate) {
        //             importDate.$selected = true;
        //         });
        //         $scope.import.numberToImport = importDates.length;
        //         $scope.import.dates = importDates;
        //     });
        // });
        // $scope.importSelectionChanged = function () {
        //     var selectedDates = $filter('filter')($scope.import.dates, function (date) {
        //         return date.$selected;
        //     });
        //     $scope.import.numberToImport = selectedDates.length;
        // };
        // $scope.importEvents = function (dates) {
        //     dates = $filter('filter')(dates, function (date) {
        //         return date.$selected;
        //     });
        //     $scope.timeline.dates = $scope.timeline.dates.concat(dates);
        //     $scope.import = angular.copy(DEFAULT_IMPORT);
        //     $state.go('create.timeline');
        // };

        /*
        =====================================================
            New Place
        =====================================================
         */
        $scope.addLocation = function (location) {
            $scope.map.locations.push(location);
            // Wait for map to be rendered
            setTimeout(function () {
                // Resize it
                google.maps.event.trigger($scope.myMap, 'resize');

                // Wait for the resize to finish
                setTimeout(function () {
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
                    // Expand the map to fit the marker
                    // bounds.extend(position);
                    $scope.map.$markers.push(marker);

                    $scope.location = {};

                    var bounds = new google.maps.LatLngBounds();
                    angular.forEach($scope.map.locations, function (location) {
                        bounds.extend(new google.maps.LatLng(location.lat, location.lon));
                    });
                    $scope.myMap.fitBounds(bounds);
                }, 0);
            }, 0);
        };

        $scope.showAddlocation = function () {
            console.log('go?');
            $scope.isAddingLocation = true;
        };

        $scope.addlocation = function (location) {
            $scope.map.locations.push(location);
        };

        // Setup the select boxes
        $scope.locationSelectOptions = {
            placeholder: 'Who or what is this about?',
            dropdownAutoWidth: true,
            minimumInputLength: 2,
            query: function (options) {
                Entity.findByName(options.term, false).then(function (entities) {
                    var data = {
                        results: []
                    };
                    angular.forEach(entities, function (entity) {
                        data.results.push({
                            id: entity.uri,
                            uri: entity.uri,
                            text: entity.name,
                            type: entity.type,
                            name: entity.name,
                            encodedUri: entity.encodedUri,
                            picture: entity.picture
                        });
                    });
                    options.callback(data);
                });
            }
        };

    });