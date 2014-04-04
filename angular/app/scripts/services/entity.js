'use strict';

angular.module('angularApp')
    .factory('Entity', function (Uris, $q, $http, Request, GraphHelper, Expression, $filter) {
        // Service logic
        // ...

        var getName = function (entity) {
            if (entity[Uris.FOAF_FIRST_NAME] || entity[Uris.FOAF_LAST_NAME]) {
                var personName = entity[Uris.FOAF_FIRST_NAME] + ' ' + entity[Uris.FOAF_LAST_NAME];
                if (entity[Uris.QA_PREF_LABEL]) {
                    // personName += ' (' + entity[Uris.QA_PREF_LABEL] + ')';
                }
                return personName;
            } else {
                return entity[Uris.QA_FIRM_NAME] || entity[Uris.FOAF_NAME] || entity[Uris.QA_LABEL];
            }

        };

        var setupNames = function (entities) {
            // Array or object
            angular.forEach(entities, function (entity) {
                entity.name = getName(entity);
                entity.encodedUri = GraphHelper.encodeUriString(entity.uri);
            });
            return entities;
        };

        var setupPicturesAndTypes = function (entities) {

            // Setup the types on these entities
            GraphHelper.setupTypes(entities);

            // Get all the preferred images
            var imageUris = GraphHelper.getAttributeValuesUnique(entities, Uris.QA_PREFERRED_IMAGE);

            // Get the images for the non-structures
            return Expression.loadList(imageUris, 'qldarch:Photograph').then(function (expressions) {
                angular.forEach(entities, function (entity) {
                    // Add images
                    // Add preferred images
                    if (angular.isDefined(entity[Uris.QA_PREFERRED_IMAGE])) {
                        // Add in the expression we got back
                        var imageUri = entity[Uris.QA_PREFERRED_IMAGE];
                        if (angular.isArray(imageUri)) {
                            imageUri = imageUri[0];
                        }
                        var expression = expressions[imageUri];
                        if (angular.isDefined(expression.file)) {
                            entity.picture = expression.file;
                        } else {
                            entity.picture = {
                                file: 'images/icon.png',
                                thumb: 'images/icon.png',
                            };
                        }
                    } else {
                        entity.picture = {
                            file: 'images/icon.png',
                            thumb: 'images/icon.png',
                        };
                    }
                });

                return entities;
            });
        };

        // Public API here
        var entity = {

            update: function (uri, data) {
                var payload = angular.copy(data);
                // Remove any extra information
                // This causes the web server to die
                delete payload.encodedUri;
                delete payload.name;
                delete payload.type;
                delete payload.picture;
                delete payload.buildingTypologies;
                delete payload.locations;
                delete payload.firm;
                delete payload.lat;
                delete payload.lon;

                var url = '/ws/rest/entity/description?ID=' + encodeURIComponent(uri);

                return $http.put(url, payload, {
                    withCredentials: true
                }).then(function (response) {
                    angular.extend(data, response.data);
                    setupNames([data]);
                });
            },

            delete: function (uri) {
                var url = '/ws/rest/entity/description?ID=' + encodeURIComponent(uri);
                return $http.delete(url);
            },

            create: function (data, rdfTypeUri) {
                var payload = angular.copy(data);
                // Remove any extra information
                // This causes the web server to die
                delete payload.encodedUri;
                delete payload.name;
                delete payload.type;
                delete payload.picture;
                delete payload.buildingTypologies;
                delete payload.locations;
                delete payload.firm;
                delete payload.lat;
                delete payload.lon;

                var url = '/ws/rest/entity/description';

                payload[Uris.RDF_TYPE] = rdfTypeUri;

                return $http.post(url, payload, {
                    withCredentials: true
                }).then(function (response) {
                    angular.extend(data, response.data);
                    setupNames([data]);
                    return data;
                });
            },

            /**
             * Finds an entity by name
             * @param name
             * @param {String=} type
             * @returns {Promise|*}
             */
            findByName: function (name, summary, type) {

                if (!type) {
                    type = 'qldarch:NonDigitalThing';
                }
                if (!angular.isDefined(summary)) {
                    summary = true;
                }

                return Request.getIndex('entity', type, summary, true).then(function (nonDigitalThings) {

                    // Create name labels for them so we can use them for our search
                    setupNames(nonDigitalThings);
                    GraphHelper.setupTypes(nonDigitalThings);


                    var results = [];
                    angular.forEach(nonDigitalThings, function (thing) {
                        if (thing.type && thing.name && thing.name.toLowerCase().indexOf(name.toLowerCase()) !== -1) {
                            results.push(thing);
                        }
                    });
                    // Go through and add in the names
                    //					console.log("FINDING BY NAME");
                    return setupPicturesAndTypes(results).then(function (entities) {
                        entities = $filter('orderBy')(entities, function (entity) {
                            // Sort by last name, first name (if its a thing with a last name)
                            // otherwise just use its name label
                            if (angular.isDefined(entity[Uris.FOAF_LAST_NAME])) {
                                return entity[Uris.FOAF_LAST_NAME] + entity[Uris.FOAF_FIRST_NAME];
                            } else {
                                return entity.name;
                            }
                        });
                        return entities;
                    });
                });
            },


            /**
             * Loads a single entity
             * @param uri
             * @returns {Promise | Summary object}
             */
            load: function (uri, summary) {
                return Request.getUri('entity', uri, summary).then(function (entity) {
                    return setupPicturesAndTypes([setupNames([entity])[0]]).then(function (entities) {
                        return entities[0];
                    });
                });
            },

            /**
             * Loads all the entities of a certain type
             * @param type      type of entity e.g. qldarch:Architect
             * @returns {Promise | Keyed list of all architects}
             */
            loadAll: function (type, summary) {
                if (!angular.isDefined(summary)) {
                    summary = true;
                }
                return Request.getIndex('entity', type, summary).then(function (entities) {
                    return setupPicturesAndTypes(setupNames(entities));
                });
            },

            /**
             * Loads a list of entities
             * @param uris
             * @param summary
             * @returns {Promise| Object keyed by entity id}
             */
            loadList: function (uris, summary) {
                return Request.getIndexForUris('entity', uris, summary).then(function (entities) {
                    return setupPicturesAndTypes(setupNames(entities));
                });
            }
        };

        return entity;
    });