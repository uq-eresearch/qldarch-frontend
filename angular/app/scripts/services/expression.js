'use strict';

angular.module('angularApp')
    .factory('Expression', function (Request, GraphHelper, Uris, File, $filter, $http, $q, toaster, $cacheFactory, $state) {
        // Service logic

        /**
         * Checks if the expression object has a file, and retrieves it
         * @param expressions
         */
        var attachFiles = function (expressions) {
            var fileUris = GraphHelper.getAttributeValuesUnique(expressions, Uris.QA_HAS_FILE);
            return File.loadList(fileUris).then(function (files) {
                //				console.log("got files", files);
                angular.forEach(expressions, function (expression) {

                    if (angular.isDefined(expression[Uris.QA_HAS_FILE])) {
                        var fileUris = GraphHelper.asArray(expression[Uris.QA_HAS_FILE]);
                        expression.files = [];
                        angular.forEach(fileUris, function (fileUri) {
                            expression.files.push(files[fileUri]);
                        });
                        expression.file = files[fileUris[0]];
                    }

                    // Setup state and state params
                    if (expression[Uris.QA_DEPICTS_BUILDING]) {
                        console.log('depects building');
                        expression.$state = 'main';
                        var params = {};
                        params.structureId = btoa(expression[Uris.QA_DEPICTS_BUILDING]);
                        if (GraphHelper.asArray(expression[Uris.RDF_TYPE]).indexOf(Uris.QA_PHOTOGRAPH_TYPE) !== -1) {
                            expression.$state = 'structure.photograph';
                            expression.$typeName = 'Photograph';
                            expression.$type = 'photograph';
                            params.photographId = expression.encodedUri;

                            expression.$parentState = 'structure.photographs';
                            expression.$parentStateParams = {
                                'structureId': params.structureId
                            };
                        }
                        if (GraphHelper.asArray(expression[Uris.RDF_TYPE]).indexOf(Uris.QA_LINEDRAWING_TYPE) !== -1) {
                            expression.$state = 'structure.lineDrawing';
                            expression.$typeName = 'Line Drawing';
                            expression.$type = 'lineDrawing';
                            params.lineDrawingId = expression.encodedUri;

                            expression.$parentState = 'structure.photographs';
                            expression.$parentStateParams = {
                                'structureId': params.structureId
                            };

                        }

                        expression.$stateParams = params;
                    } else {
                        // @todo make this work for other non 'depicts building' types
                        expression.$state = 'main';
                        expression.$stateParams = '{}';
                    }

                    if (expression[Uris.RDF_TYPE]) {
                        // Setup the type
                        var typeUris = GraphHelper.asArray(expression[Uris.RDF_TYPE]);
                        if (typeUris.indexOf(Uris.QA_PHOTOGRAPH_TYPE) !== -1 || typeUris.indexOf(Uris.QA_LINEDRAWING_TYPE) !== -1) {
                            // Its an image
                            expression.type = 'image';
                        } else if (typeUris.indexOf(Uris.QA_ARTICLE_TYPE) !== -1) {
                            expression.type = 'article';
                        } else if (typeUris.indexOf(Uris.QA_INTERVIEW_TYPE) !== -1) {

                        }

                        if (expression.type) {
                            var params2 = {};
                            params2[expression.type + 'Id'] = expression.encodedUri;
                            expression.$link = $state.href(expression.type, params2);
                            expression.$linkTo = function (sub) {
                                return $state.href(expression.type + '.' + sub, params);
                            };
                            expression.$state = expression.type;
                            expression.$stateTo = function (sub) {
                                return expression.$state + '.' + sub;
                            };
                            expression.$stateParams = params2;
                        }

                    }


                });

                return expressions;
            });
        };

        var clearImageCache = function () {
            $cacheFactory.get('$http').remove('/ws/rest/expression/detail/qldarch%3APhotograph?INCSUBCLASS=false&');
            $cacheFactory.get('$http').remove('/ws/rest/expression/detail/qldarch%3ALineDrawing?INCSUBCLASS=false&');
        };

        var expression = {

            findByUser: function (email) {
                return Request.http(Uris.JSON_ROOT + 'expression/user', {
                    ID: email
                }, false).then(function (expressions) {
                    console.log('expressions', expressions);
                    return attachFiles(GraphHelper.graphValues(expressions));
                });
            },

            /**
             * Finds all photos that depict a building in a list
             * @param buildingUris  Array of building uris
             */
            findByBuildingUris: function (buildingUris, type) {
                if (!angular.isDefined(type)) {
                    throw ('Type needs to be defined');
                }
                return Request.getIndex('expression', type, false, false).then(function (expressions) {
                    var photographs = [];
                    angular.forEach(expressions, function (expression) {
                        if (angular.isDefined(expression[Uris.QA_DEPICTS_BUILDING]) && buildingUris.indexOf(expression[Uris.QA_DEPICTS_BUILDING]) !== -1) {
                            photographs.push(expression);
                        }
                    });
                    console.log('hphotographs', photographs);
                    return attachFiles(photographs);
                });
            },

            /**
             * Finds all photos that have an associated firm
             * @param firmUris  Array of firm uris
             */
            findByFirmUris: function (firmUris, type) {
                if (!angular.isDefined(type)) {
                    throw ('Type needs to be defined');
                }
                return Request.getIndex('expression', type, false, false).then(function (expressions) {
                    var photographs = [];
                    angular.forEach(expressions, function (expression) {
                        if (angular.isDefined(expression[Uris.QA_ASSOCIATED_FIRM]) && firmUris.indexOf(expression[Uris.QA_ASSOCIATED_FIRM]) !== -1) {
                            photographs.push(expression);
                        }
                    });
                    return attachFiles(photographs);
                });
            },


            /**
             * Finds all photos that have an associated firm
             * @param firmUris  Array of firm uris
             */
            findByArchitectUris: function (architectUris, type) {
                if (!angular.isDefined(type)) {
                    throw ('Type needs to be defined');
                }
                return Request.getIndex('expression', type, false, false).then(function (expressions) {
                    var photographs = $filter('filter')(GraphHelper.graphValues(expressions), function (expression) {
                        return architectUris.indexOf(expression[Uris.QA_RELATED_TO]) >= 0;
                    });
                    return attachFiles(photographs);
                });
            },

            create: function (data) {
                var payload = angular.copy(data);

                delete payload.building;
                delete payload.file;
                delete payload.files;
                delete payload.encodedUri;
                delete payload.type;

                var url = Uris.JSON_ROOT + 'expression/description';
                return $http.post(url, payload, {
                    withCredentials: true
                }).then(function (response) {
                    clearImageCache();
                    angular.extend(data, response.data);
                    data.encodedUri = GraphHelper.encodeUriString(data.uri);
                    toaster.pop('success', data[Uris.DCT_TITLE] + ' created.', 'You have successfully created ' + data[Uris.DCT_TITLE]);
                    return attachFiles(data);
                }, function () {
                    toaster.pop('error', 'Error occured.', 'Sorry, we couldn\t created at this time');
                });
            },

            update: function (uri, data) {
                var payload = angular.copy(data);
                // Remove any extra information
                // This causes the web server to die
                delete payload.building;
                delete payload.file;
                delete payload.files;
                delete payload.encodedUri;
                delete payload.type;

                console.log('payload', payload);

                var url = '/ws/rest/expression/description?ID=' + encodeURIComponent(uri);

                return $http.put(url, payload, {
                    withCredentials: true
                }).then(function (response) {
                    angular.extend(data, response.data);
                    attachFiles(data);
                    // setupNames([data]);
                    // Display alert
                    toaster.pop('success', data[Uris.DCT_TITLE] + ' updated.', 'You have successfully updated ' + data[Uris.DCT_TITLE]);
                }, function () {
                    toaster.pop('error', 'Error occured.', 'Sorry, we couldn\t updated at this time');
                });
            },

            delete: function (uri, expression) {
                var type;
                if (GraphHelper.asArray(expression[Uris.RDF_TYPE]).indexOf(Uris.QA_PHOTOGRAPH_TYPE) !== -1) {
                    type = 'photograph';
                }
                if (GraphHelper.asArray(expression[Uris.RDF_TYPE]).indexOf(Uris.QA_LINEDRAWING_TYPE) !== -1) {
                    type = 'line drawing';
                }
                if (GraphHelper.asArray(expression[Uris.RDF_TYPE]).indexOf(Uris.QA_ARTICLE_TYPE) !== -1) {
                    type = 'article';
                }
                var r = window.confirm('Delete ' + type + ' ' + expression[Uris.DCT_TITLE] + '?');

                if (r === true) {
                    var url = '/ws/rest/expression/description?ID=' + encodeURIComponent(uri);
                    return $http.delete(url).then(function () {
                        // Invalidate our cache of expressions
                        clearImageCache();

                        // Display alert
                        toaster.pop('success', expression[Uris.DCT_TITLE] + ' deleted.', 'You have successfully deleted ' + expression[Uris.DCT_TITLE]);
                    }, function () {
                        toaster.pop('error', 'Error occured.', 'Sorry, we couldn\t delete at this time');
                    });
                } else {
                    return $q.reject();
                }
            },



            /**
             * Loads a single entity
             * @param uri
             * @param type
             * @returns {*}
             */
            load: function (uri) {
                return Request.getUri('expression', uri, false).then(function (expression) {
                    return attachFiles([expression]).then(function () {
                        return expression;
                    });
                });
                // @todo - original loading code
                // console.log('hello?', type, uri);
                // if (!type) {
                //     console.log('throw dude');
                //     throw ('you need to include type, hopefully this will be fixed in the future');
                // }
                // return Request.getIndex('expression', type, false, false).then(function (expressions) {
                //     var expression = expressions[uri];
                //     return attachFiles([expression]).then(function () {
                //         return expression;
                //     });
                // });
            },

            loadAll: function (type) {
                if (!type) {
                    throw ('you need to include type, hopefully this will be fixed in the future');
                }

                return Request.getIndex('expression', type, true).then(function (expressions) {
                    return attachFiles(expressions);
                });
            },

            /**
             * Loads a list of expressions
             * @param uris
             * @param type
             * @returns {*}
             */
            loadList: function (uris, type, summary) {
                // Because its broken, we need to do a getIndex and filter
                // IDLIST isn't working like it should

                if (!type) {
                    throw ('you need to include type, hopefully this will be fixed in the future');
                }
                if (!angular.isDefined(summary)) {
                    summary = true;
                }
                return Request.getIndex('expression', type, summary).then(function (expressions) {
                    var filteredExpressions = {};
                    angular.forEach(uris, function (uri) {
                        filteredExpressions[uri] = expressions[uri];
                    });

                    return attachFiles(filteredExpressions);
                });
            }
        };

        // Public API here
        return expression;
    });