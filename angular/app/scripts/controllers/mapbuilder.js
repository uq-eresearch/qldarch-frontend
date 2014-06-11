'use strict';

angular.module('angularApp')
    .controller('MapBuilderCtrl', function ($scope, compoundObject, typologies, Entity, Uris, Relationship, GraphHelper, Structure, $filter, $state, Auth, CompoundObject, Firm, Architect) {
        /*
        =====================================================
            Setup
        =====================================================
         */
        $scope.compoundObject = compoundObject.jsonData; // alias for convenience
        $scope.map = compoundObject.jsonData.data; // alias for convenience
        $scope.map.$import = {};
        $scope.typologies = typologies;

        if (!compoundObject.uri) {
            $scope.map.locations = [];
            $scope.compoundObject.user = Auth;
            $scope.compoundObject.type = 'map';
        }


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
                        if (entity.type === 'architect' || entity.type === 'buildingtypology' || entity.type === 'firm' || (entity.type === 'structure' && angular.isDefined(entity[Uris.GEO_LAT]))) {

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
                                encodedUri: entity.encodedUri
                            });
                        }

                    });
                    options.callback(data);
                });
            }
        };

        /**
         * Watches for the import entity to be changed, and fetches a list of structures
         * @param  {[type]} entity [description]
         * @return {[type]}        [description]
         */
        $scope.$watch('map.$import.entity', function (entity) {
            if (!entity) {
                return;
            }

            // Clear the current locations
            $scope.map.$import.locations = null;

            // Find locations
            if (entity.type === 'architect') {
                Relationship.findBySubjectPredicateObject({
                    predicate: 'qldarch:designedBy',
                    object: entity.uri
                }).then(function (designedByRelationships) {
                    var designedByStructureUris = GraphHelper.getAttributeValuesUnique(designedByRelationships, Uris.QA_SUBJECT);

                    Relationship.findBySubjectPredicateObject({
                        predicate: 'qldarch:workedOn',
                        subject: entity.uri
                    }).then(function (workedOnRelationships) {
                        var workedOnStructureUris = GraphHelper.getAttributeValuesUnique(workedOnRelationships, Uris.QA_OBJECT);

                        // Merge
                        var structureUris = designedByStructureUris.concat(workedOnStructureUris);
                        console.log(workedOnStructureUris);
                        Structure.loadList(structureUris, true).then(function (structures) {
                            // Convert structures to locations
                            addStructuresAsLocations(structures);
                        });
                    });
                });

                // Look for a firm
            } else if (entity.type === 'firm') {
                var firmUri = entity.uri;
                Relationship.findBySubjectPredicateObject({
                    predicate: 'qldarch:designedBy',
                    object: firmUri
                }).then(function (relationships) {
                    // Get all the architects
                    var structureUris = GraphHelper.getAttributeValuesUnique(relationships, Uris.QA_SUBJECT);

                    Structure.loadList(structureUris, true).then(function (structures) {
                        var relationshipStructures = GraphHelper.graphValues(structures);

                        // Get the associated firms...this is awful
                        // should be all relationships or nothing!
                        Structure.findByAssociatedFirmUri(firmUri).then(function (firmStructures) {
                            var structures = angular.extend(relationshipStructures, firmStructures);
                            structures = GraphHelper.graphValues(structures);
                            addStructuresAsLocations(structures);
                        });
                    });
                });

                // Looking for astructure
            } else if (entity.type === 'structure') {
                Structure.load(entity.uri, true).then(function (structure) {
                    addStructuresAsLocations([structure]);
                });

            } else if (entity.type === 'buildingtypology') {

                Structure.findByBuildingTypologyUri(entity.uri).then(function (structures) {
                    structures = GraphHelper.graphValues(structures);
                    addStructuresAsLocations(structures);
                });
            }

        });

        /*
        =====================================================
            Import Places
        =====================================================
         */
        function addStructuresAsLocations(structures) {
            $scope.map.$import.locations = [];
            $scope.map.$import.filter = {australian: 'all'};

            $scope.map.$import.architects = [];
            $scope.map.$import.firms = [];
            var firmUris = [];
            $scope.map.$import.typologies = [];

            angular.forEach(structures, function (structure) {
                // Filter out buildings that dont have a location
                // We cant display them, so we don't show them
                if (structure.lat) {
                    var location = angular.copy(structure);
                    angular.extend(location, {
                        name: structure.name,
                        lat: structure.lat,
                        lon: structure.lon,
                        uri: structure.uri,
                        type: 'structure',
                        asset: {
                            media: 'images/icon.png',
                            thumbnail: 'images/icon.png',
                        }
                    });
                    // Add in a picture if there is one
                    if (structure.picture) {
                        location.asset = {
                            media: structure.picture.file,
                            thumbnail: structure.picture.thumb,
                        };
                    }

                    // Check if we already have added it
                    console.log('checking', location.name, location.uri);
                    angular.forEach($scope.map.locations, function (addedLocation) {
                        console.log('- ', addedLocation.uri);
                        if (addedLocation.uri === location.uri) {
                            location.$added = true;
                        }
                    });

                    // Add it to the list of locations to display
                    $scope.map.$import.locations.push(location);

                    // Add its building typologies to the list for the filter
                    if (structure.buildingTypologies) {
                        angular.forEach(structure.buildingTypologies, function (structureBuildingTypology) {
                            var found = false;
                            // console.log('typology', structure.name, structureBuildingTypology.name);
                            angular.forEach($scope.map.$import.typologies, function (filterBuildingTypology) {
                                if (structureBuildingTypology.uri === filterBuildingTypology.uri) {
                                    found = true;
                                }
                            });
                            if (!found) {
                                $scope.map.$import.typologies.push(structureBuildingTypology);
                            }
                        });
                    }

                    // Store the firms
                    if (structure[Uris.QA_ASSOCIATED_FIRM]) {
                        firmUris.push(structure[Uris.QA_ASSOCIATED_FIRM]);
                    }

                    // Find the people that built it
                    Relationship.findBySubjectPredicateObject({
                        predicate: 'qldarch:designedBy',
                        subject: structure.uri
                    }).then(function (designedByRelationships) {
                        var designedByArchitectUris = GraphHelper.getAttributeValuesUnique(designedByRelationships, Uris.QA_OBJECT);

                        Relationship.findBySubjectPredicateObject({
                            predicate: 'qldarch:workedOn',
                            object: structure.uri
                        }).then(function (workedOnRelationships) {
                            var workedOnArchitectUris = GraphHelper.getAttributeValuesUnique(workedOnRelationships, Uris.QA_SUBJECT);

                            // Merge
                            var architectUris = designedByArchitectUris.concat(workedOnArchitectUris);
                            Architect.loadList(architectUris, true).then(function (architects) {
                                location.architects = architects;
                                // Add it to list to filter by (if its not already there)
                                angular.forEach(architects, function (structureArchitect) {
                                    var found = false;
                                    // In case we get any firms in there
                                    if (structureArchitect.type === 'architect') {
                                        angular.forEach($scope.map.$import.architects, function (importArchitect) {
                                            if (structureArchitect.uri === importArchitect.uri) {
                                                // already added
                                                found = true;
                                            }
                                        });
                                        if (!found) {
                                            $scope.map.$import.architects.push(structureArchitect);
                                        }
                                    }
                                });
                            });
                        });
                    });
                }
            });

            Firm.loadList(firmUris).then(function (firms) {
                $scope.map.$import.firms = firms;
            });
            generateProspectiveLocations();
        }

        /*
        =====================================================
            Selecting Items from Import
        =====================================================
         */
        $scope.addAll = function () {
            var filteredLocations = $filter('filter')($scope.map.$import.locations, $scope.importFilter);
            addLocationsToMap(filteredLocations);
            $scope.map.$import.entity = null;
            $scope.map.$import.locations = null;
            $scope.isShowingFilters = false;
            $state.go('ugc.map.edit');
        };
        $scope.cancel = function () {
            $scope.map.$import.entity = null;
            $scope.map.$import.locations = null;
            $scope.map.$import.prospectiveLocations = [];
            $scope.isShowingFilters = false;
            $state.go('ugc.map.edit');
        };
        $scope.add = function (location) {
            addLocationsToMap([location]);
        };

        function addLocationsToMap(locations) {
            var locationsToAdd = [];
            // Filter out ones we have already added
            angular.forEach(locations, function (location) {
                if (!location.$added) {
                    location.$added = true;
                    locationsToAdd.push(location);
                }
            });
            // Add to map
            $scope.map.locations = locationsToAdd.concat($scope.map.locations);
            generateProspectiveLocations();
        }

        function removeLocationFromMap(location) {
            // Go through ones in the import list
            angular.forEach($scope.map.$import.locations, function (importLocation) {
                if (location.uri === importLocation.uri) {
                    importLocation.$added = false;
                }
            });
            var index = $scope.map.locations.indexOf(location);
            $scope.map.locations.splice(index, 1);
            generateProspectiveLocations();
        }

        $scope.importFilter = function (location) {
            var result = true;
            var found;
            if (angular.isDefined($scope.map.$import.filter)) {
                if (angular.isDefined($scope.map.$import.filter.typologyUri) && $scope.map.$import.filter.typologyUri.length) {
                    found = false;
                    angular.forEach(GraphHelper.asArray(location[Uris.QA_BUILDING_TYPOLOGY_P]), function (typologyUri) {
                        if (typologyUri === $scope.map.$import.filter.typologyUri) {
                            found = true;
                        }
                    });
                    result = result && found;
                }
                if (angular.isDefined($scope.map.$import.filter.startYear) && $scope.map.$import.filter.startYear.length) {
                    result = result && parseInt(location[Uris.QA_COMPLETION_DATE]) >= parseInt($scope.map.$import.filter.startYear);
                }
                if (angular.isDefined($scope.map.$import.filter.endYear) && $scope.map.$import.filter.endYear.length) {
                    result = result && parseInt(location[Uris.QA_COMPLETION_DATE]) <= parseInt($scope.map.$import.filter.endYear);
                }
                // Name filter
                if ($scope.map.$import.filter.filter) {
                    result = result && (location.name.toLowerCase().indexOf($scope.map.$import.filter.filter.toLowerCase()) !== -1);
                }
                // Location filter
                if ($scope.map.$import.filter.location) {
                    found = false;
                    angular.forEach(location.locations, function (locationName) {
                        if (locationName.toLowerCase().indexOf($scope.map.$import.filter.location.toLowerCase()) !== -1) {
                            found = true;
                        }
                    });
                    result = result && found;
                }
                // Firm filter
                if ($scope.map.$import.filter.firmUri) {
                    result = result && location[Uris.QA_ASSOCIATED_FIRM] === $scope.map.$import.filter.firmUri;
                }
                // Australian filter
                if ($scope.map.$import.filter.australian) {
                	if ($scope.map.$import.filter.australian == "australian") {
                		result = result && ((parseFloat(location.lat) < -10) && (parseFloat(location.lat) > -45) 
                    			&& (parseFloat(location.lon) > 109) && (parseFloat(location.lat) < 155));
                	} else if ($scope.map.$import.filter.australian == "other") {
                		result = result && ((parseFloat(location.lat) > -10) || (parseFloat(location.lat) < -45) 
                				|| (parseFloat(location.lon) < 109) || (parseFloat(location.lat) > 155));
                	}
                }
                // architect filter
                if ($scope.map.$import.filter.architectUri) {
                    found = false;
                    angular.forEach(location.architects, function (architect) {
                        if (architect.uri === $scope.map.$import.filter.architectUri) {
                            found = true;
                        }
                    });
                    result = result && found;
                }
            }
            return result;
        };
        $scope.clearImportFilters = function () {
            $scope.map.$import.filter = {};
        };

        $scope.$watch('map.$import.filter', function () {
            generateProspectiveLocations();
        }, true);

        function generateProspectiveLocations() {
            var filteredLocations = $filter('filter')($scope.map.$import.locations, $scope.importFilter);
            filteredLocations = $filter('filter')(filteredLocations, function (location) {
                return !location.$added;
            });
            $scope.map.$import.prospectiveLocations = filteredLocations;
        }



        /*
        =====================================================
            New Place
        =====================================================
         */
        $scope.addLocation = function (location) {
            // Store the location
            location.asset = {
                media: 'images/icon.png',
                thumbnail: 'images/icon.png',
            };
            $scope.map.locations.unshift(location);
            // Clear the entry
            $scope.map.$tempLocation = {};
            $state.go('ugc.map.edit');
        };

        /*
        =====================================================
            Delete Locations
        =====================================================
         */
        $scope.remove = function (location) {
            removeLocationFromMap(location);
        };

        /*
        =====================================================
            Save Map 
        =====================================================
         */
        $scope.save = function () {
            if (!compoundObject.uri) {
                CompoundObject.store($scope.compoundObject).then(function (data) {
                    $state.go('ugc.map', {
                        id: data.encodedUri
                    });
                });
            } else {
                CompoundObject.update(compoundObject.uri, $scope.compoundObject).then(function (data) {
                    $state.go('ugc.map', {
                        id: data.encodedUri
                    });
                });
            }
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


//     'use strict';

// angular.module('angularApp')
//     .controller('CreateMapCtrl', function ($scope, Entity, $state, Relationship, Structure, GraphHelper, Uris, $filter, Auth, CompoundObject) {



//     });