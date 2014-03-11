'use strict';

angular.module('angularApp')
    .factory('Structure', function (Entity, GraphHelper, Expression, Uris, $q, $filter) {
        // Service logic

        var postProcess = function (structures) {
            // Setup lats and lons
            var uris = GraphHelper.getAttributeValuesUnique(structures, ['uri']);
            angular.forEach(structures, function (structure) {
                if (angular.isDefined(structure[Uris.GEO_LONG])) {
                    if (angular.isArray(structure[Uris.GEO_LONG])) {
                        structure.lon = structure[Uris.GEO_LONG][0];
                    } else {
                        structure.lon = structure[Uris.GEO_LONG];
                    }
                }
                if (angular.isDefined(structure[Uris.GEO_LAT])) {
                    if (angular.isArray(structure[Uris.GEO_LAT])) {
                        structure.lat = structure[Uris.GEO_LAT][0];
                    } else {
                        structure.lat = structure[Uris.GEO_LAT];
                    }
                }

                if (angular.isDefined(structure.lat) && angular.isDefined(structure.lon)) {
                    if (-44.902578 < structure.lat && structure.lat < -9.102097 &&
                        104.765625 < structure.lon && structure.lon < 159.697266) {
                        structure[Uris.QA_AUSTRALIAN] = true;
                    }
                }

                if (angular.isDefined(structure[Uris.QA_LOCATION])) {
                    structure.locations = GraphHelper.asArray(structure[Uris.QA_LOCATION]);
                }
            });


            // Setup pictures
            return Expression.findByBuildingUris(uris, 'qldarch:Photograph').then(function (pictures) {
                angular.forEach(pictures, function (picture) {
                    angular.forEach(structures, function (structure) {
                        if (picture[Uris.QA_DEPICTS_BUILDING] === structure.uri) {
                            structure.picture = picture.file;
                        }
                    });
                });

                // Setting building typologies
                var buildingTypologyUris = [];
                angular.forEach(structures, function (structure) {
                    buildingTypologyUris = buildingTypologyUris.concat(GraphHelper.asArray(structure[Uris.QA_BUILDING_TYPOLOGY_P]));
                });

                return Entity.loadList(buildingTypologyUris).then(function (buildingTypologies) {
                    angular.forEach(structures, function (structure) {
                        structure.buildingTypologies = [];
                        angular.forEach(GraphHelper.asArray(structure[Uris.QA_BUILDING_TYPOLOGY_P]), function (buildingTypologyUri) {
                            structure.buildingTypologies.push(buildingTypologies[buildingTypologyUri]);
                        });
                    });
                    return structures;
                });
            });
        };

        // Public API here
        return {
            /**
             * Finds an Architect by 'name'
             * @param name
             * @returns {Promise| Object} All architects that match
             */
            findByName: function (name) {
                return Entity.findByName(name, 'qldarch:Structure');
            },

            findByBuildingTypologyUri: function (buildingTypologyUri) {
                return Entity.loadAll('qldarch:Structure', false).then(function (structures) {
                    structures = GraphHelper.graphValues(structures);
                    console.log(structures);
                    return postProcess($filter('filter')(structures, buildingTypologyUri));
                });
            },

            findByAssociatedFirmUri: function (associatedFirmUri) {
                return Entity.loadAll('qldarch:Structure', false).then(function (structures) {
                    structures = GraphHelper.graphValues(structures);
                    return postProcess($filter('filter')(structures, function (structure) {
                        return structure[Uris.QA_ASSOCIATED_FIRM] === associatedFirmUri;
                    }));
                });
            },


            /**
             * Loads a single Architect
             * @param uri
             * @returns {Promise | Object}
             */
            load: function (uri, summary) {
                return Entity.load(uri, summary).then(function (structure) {
                    return postProcess([structure]).then(function (structures) {

                        // Load the building typology
                        var structure = structures[0];

                        //						if(angular.isDefined(structure[Uris.GEO_LONG])) {
                        //							if(angular.isArray(structure[Uris.GEO_LONG])) {
                        //								structure.lon = structure[Uris.GEO_LONG][0];
                        //							} else {
                        //								structure.lon = structure[Uris.GEO_LONG];
                        //							}
                        //						}
                        //						if(angular.isDefined(structure[Uris.GEO_LAT])) {
                        //							if(angular.isArray(structure[Uris.GEO_LAT])) {
                        //								structure.lat = structure[Uris.GEO_LAT][0];
                        //							} else {
                        //								structure.lat = structure[Uris.GEO_LAT];
                        //							}
                        //						}

                        // Load the associated firm
                        if (angular.isDefined(structure[Uris.QA_BUILDING_TYPOLOGY_P]) || angular.isDefined(structure[Uris.QA_ASSOCIATED_FIRM])) {


                            var requests = [];
                            angular.forEach(GraphHelper.asArray(structure[Uris.QA_BUILDING_TYPOLOGY_P]), function (typologyUri) {
                                requests.push(Entity.load(typologyUri, true));
                            });

                            return $q.all(requests).then(function (typologies) {

                                structure.buildingTypologies = [];
                                angular.forEach(typologies, function (typology) {
                                    structure.buildingTypologies.push(typology);
                                });
                                console.log('got to here', structure[Uris.QA_ASSOCIATED_FIRM]);
                                if (angular.isDefined(structure[Uris.QA_ASSOCIATED_FIRM])) {
                                    return Entity.load(structure[Uris.QA_ASSOCIATED_FIRM], true).then(function (firm) {
                                        structure.firm = firm;
                                        return structure;
                                    });
                                } else {
                                    return structure;
                                }
                            })
                        } else {
                            return structure;
                        }
                    });
                });
            },

            /**
             * Loads all the entities of a certain type
             * @returns {Promise | Object} All architects
             */
            loadAll: function (summary) {
                if (!angular.isDefined(summary)) {
                    summary = true;
                }
                return Entity.loadAll('qldarch:Structure', summary).then(function (structures) {
                    // get the uris
                    return postProcess(structures);
                });
            },

            /**
             * Loads a list of entities
             * @param uris
             * @returns {Promise| Object} All architects with uris
             */
            loadList: function (uris) {
                return Entity.loadList(uris, false).then(function (structures) {
                    // get the uris
                    return postProcess(structures);
                });
            }
        };
    });