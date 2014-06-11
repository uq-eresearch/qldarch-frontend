'use strict';

angular.module('angularApp')
    .factory('Entity', function (Uris, $q, $http, Request, GraphHelper, Expression, $filter, toaster, $cacheFactory) {
        // Service logic
        // ...

        var getName = function (entity) {
            if (entity[Uris.FOAF_FIRST_NAME] || entity[Uris.FOAF_LAST_NAME]) {
                var personName = entity[Uris.FOAF_FIRST_NAME] + ' ' + entity[Uris.FOAF_LAST_NAME];
                if (entity[Uris.QA_PREF_LABEL]) {
                    personName += ' (' + entity[Uris.QA_PREF_LABEL] + ')';
                }
                return personName;
            } else {
                return entity[Uris.QA_CITATION] || entity[Uris.QA_TOPIC_HEADING] || entity[Uris.QA_EVENT_TITLE] || entity[Uris.QA_AWARD_TITLE] || 
                				entity[Uris.QA_FIRM_NAME] || entity[Uris.FOAF_NAME] || entity[Uris.QA_LABEL] || 'Unknown';
            }
        };

        /*
"Notre Dame du Haut, Ronchamps, France"
1: "Chapel Notre Dame du Haut, Ronchamp, France"

 */
        var setupNames = function (entities) {
            // Array or object
            angular.forEach(entities, function (entity) {

                // Make the entities auto-complete compatible (for select2)
                entity.name = getName(entity);
                entity.text = entity.name;
                entity.id = entity.uri;
                // if (angular.isArray(entity.name)) {
                //     console.log('an array?', entity.name);
                //     entity.name = entity.name[0];
                // }
                entity.encodedUri = GraphHelper.encodeUriString(entity.uri);
            });
            return entities;
        };

        var setupPicturesAndTypes = function (entities) {

            // Setup the types on these entities
            GraphHelper.setupTypes(entities);

            // Get all the preferred images
            // var imageUris = GraphHelper.getAttributeValuesUnique(entities, Uris.QA_PREFERRED_IMAGE);

            // Set the default picture
            angular.forEach(entities, function (entity) {
                entity.picture = {
                    file: 'images/icon.png',
                    thumb: 'images/icon.png',
                };
            });

            // Overwrite the pictures if we have them
            // @todo: remove kludge
            // This is a complete kludge because the server is not automatically setting 
            // the preferred image of an entity to be a file
            // 
            return Expression.loadAllFull('qldarch:Photograph').then(function (expressions) {
                console.log('expressions', expressions);
                // return Expression.loadList(imageUris, 'qldarch:Photograph').then(function (expressions) {
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

                angular.forEach(expressions, function (expression) {
                    // this.QA_DEPICTS_BUILDING = this.QA_NS + 'depictsBuilding';
                    // this.QA_DEPICTS_ARCHITECT = this.QA_NS + 'depictsArchitect';
                    var depictsUri = expression[Uris.QA_DEPICTS_BUILDING] || expression[Uris.QA_DEPICTS_ARCHITECT];
                    if (depictsUri) {
                        // console.log('expression depicts someone or something', depictsUri);
                        if (depictsUri === 'http://qldarch.net/users/patriciadowling/Architect#63377814877') {
                            console.log('MATCH');
                        }
                        // its a photo of an architect or building
                        angular.forEach(entities, function (entity) {
                            if (entity.uri === depictsUri && angular.isDefined(expression.file)) {
                                entity.picture = expression.file;
                            }
                        });
                    }
                });
                return entities;
            });
        };

        var clearEntityCaches = function () {
            $cacheFactory.get('$http').remove('/ws/rest/entity/detail/qldarch%3ANonDigitalThing?INCSUBCLASS=true&');
            $cacheFactory.get('$http').remove('/ws/rest/entity/detail/qldarch%3AArchitect?INCSUBCLASS=false&');
            $cacheFactory.get('$http').remove('/ws/rest/entity/detail/qldarch%3AFirm?INCSUBCLASS=false&');
            $cacheFactory.get('$http').remove('/ws/rest/entity/detail/qldarch%3AStructure?INCSUBCLASS=false&');
            // http://127.0.0.1:9000/ws/rest/entity/detail/qldarch%3ANonDigitalThing?INCSUBCLASS=true&
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
                delete payload.text;
                delete payload.id;

                var url = '/ws/rest/entity/description?ID=' + encodeURIComponent(uri);

                return $http.put(url, payload, {
                    withCredentials: true
                }).then(function (response) {
                    clearEntityCaches();
                    angular.extend(data, response.data);
                    setupNames([data]);
                    toaster.pop('success', data.name + ' updated.');
                }, function () {
                    toaster.pop('error', 'Error occured.', 'Sorry, we save at this time');
                });
            },

            delete: function (uri) {
                var url = '/ws/rest/entity/description?ID=' + encodeURIComponent(uri);
                return $http.delete(url).then(function () {
                    clearEntityCaches();
                });
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
                    clearEntityCaches();
                    angular.extend(data, response.data);
                    data.encodedUri = GraphHelper.encodeUriString(data.uri);
                    setupNames([data]);
                    toaster.pop('success', data.name + ' created.');
                    return data;
                }, function () {
                    toaster.pop('error', 'Error occured.', 'Sorry, we save at this time');
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

                // console.log('Entity: Finding by name');

                return Request.getIndex('entity', type, summary, true).then(function (nonDigitalThings) {

                    // console.log('Got entities');
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

            loadAllIncSubclass: function (type, summary) {
                if (!angular.isDefined(summary)) {
                    summary = true;
                }
                return Request.getIndex('entity', type, summary, true).then(function (entities) {
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