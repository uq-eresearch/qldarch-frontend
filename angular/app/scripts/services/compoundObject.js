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
                // http://localhost:9000/ws/rest/compoundObject/id?ID=http%3A%2F%2Fqldarch.net%2Fusers%2Fcmcnamara87%40gmail.com%2FCompoundObject%2367624360566
                return $http.get(Uris.JSON_ROOT + 'compoundObject/id?ID=' + encodeURIComponent(uri)).then(function (response) {
                    var compoundObject = {
                        uri: uri,
                        jsonData: response.data
                    };
                    return compoundObject;
                });
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
                compoundObject.modified = Math.round(new Date().getTime() / 1000);
                return $http.post(Uris.JSON_ROOT + 'compoundObject', compoundObject).then(function (response) {
                    GraphHelper.encodeUri(response.data);
                    return response.data;
                });
            },

            update: function (uri, compoundObject) {
                compoundObject.modified = Math.round(new Date().getTime() / 1000);
                return $http.put(Uris.JSON_ROOT + 'compoundObject?ID=' + encodeURIComponent(uri), compoundObject).then(function (response) {
                    GraphHelper.encodeUri(response.data);
                    return response.data;
                });
            },

            delete: function (uri) {
                throw ('Delete is not implemented ' + uri);
            }
        };
    });