'use strict';

angular.module('angularApp')
    .factory('Entity', function (Uris, $q, $http, Request, GraphHelper, Expression) {
        // Service logic
        // ...

        var getName = function (entity) {
            return entity[Uris.QA_LABEL] ||
                entity[Uris.QA_FIRM_NAME] ||
                entity[Uris.FOAF_NAME] ||
                entity[Uris.FOAF_FIRST_NAME] + " " + entity[Uris.FOAF_LAST_NAME]
        };

        var setupNames = function (entities) {
            // Array or object
            angular.forEach(entities, function (entity) {
                entity.name = getName(entity);
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
                        }
                    }
                });

                return entities;
            });
        };

        // Public API here
        var entity = {

            /**
             * Finds an entity by name
             * @param name
             * @param {String=} type
             * @returns {Promise|*}
             */
            findByName: function (name, summary, type) {
                var results = [];

                var promises = [];

                if (!type) {
                    type = "qldarch:NonDigitalThing";
                }
                if (!angular.isDefined(summary)) {
                    summary = true;
                }

                return Request.getIndex('entity', type, summary, true).then(function (nonDigitalThings) {
                    // Create name labels for them so we can use them for our search
                    setupNames(nonDigitalThings);

                    var results = [];
                    angular.forEach(nonDigitalThings, function (thing) {
                        if (thing.name.toLowerCase().indexOf(name.toLowerCase()) != -1) {
                            results.push(thing);
                        }
                    });
                    // Go through and add in the names
                    //					console.log("FINDING BY NAME");
                    return setupPicturesAndTypes(results);
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