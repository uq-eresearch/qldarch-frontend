'use strict';

angular.module('angularApp')
    .factory('Expression', function (Request, GraphHelper, Uris, File) {
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
                });
                return expressions;
            });
        };

        var expression = {

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
             * Loads a single entity
             * @param uri
             * @param type
             * @returns {*}
             */
            load: function (uri, type) {
                console.log('hello?', type, uri);
                if (!type) {
                    console.log('throw dude');
                    throw ('you need to include type, hopefully this will be fixed in the future');
                }
                return Request.getIndex('expression', type, false, false).then(function (expressions) {
                    var expression = expressions[uri];
                    return attachFiles([expression]).then(function () {
                        return expression;
                    });
                });
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