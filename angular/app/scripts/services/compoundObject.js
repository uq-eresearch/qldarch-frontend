'use strict';

angular.module('angularApp')
    .factory('CompoundObject', function ($http, Uris, GraphHelper) {
        // Service logic
        // ...

        // Public API here
        return {
            /**
             * Loads a single entity
             * @param uri
             * @returns {Promise | Summary object}
             */
            load: function (uri) {
                throw ('Load is not implemented ' + uri);
            },

            loadAll: function () {
                return $http.get(Uris.JSON_ROOT + 'compoundObject').then(function (response) {
                    GraphHelper.encodeUris(response.data);
                    angular.forEach(response.data, function (compoundObject) {
                        compoundObject.jsonData = angular.fromJson(compoundObject[Uris.QA_JSON_DATA]);
                    });
                    var compoundObjects = GraphHelper.graphValues(response.data);
                    return compoundObjects;
                });
            },

            loadForUser: function (username) {
                return $http.get(Uris.JSON_ROOT + 'compoundObject/user?username=' + username).then(function (response) {
                    GraphHelper.encodeUris(response.data);
                    angular.forEach(response.data, function (compoundObject) {
                        compoundObject.jsonData = angular.fromJson(compoundObject[Uris.QA_JSON_DATA]);
                    });
                    var compoundObjects = GraphHelper.graphValues(response.data);
                    return compoundObjects;
                });
            },

            store: function (compoundObject) {
                return $http.post(Uris.JSON_ROOT + 'compoundObject', compoundObject).then(function (response) {
                    GraphHelper.encodeUri(response.data);
                    return response.data;
                });
            },

            update: function (uri, compoundObject) {
                throw ('Update is not implemented ' + uri + ' ' + compoundObject);
            },

            delete: function (uri) {
                throw ('Delete is not implemented ' + uri);
            }
        };
    });