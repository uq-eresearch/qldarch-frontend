'use strict';

angular.module('qldarchApp').factory('CompoundObject', function ($http, Uris, GraphHelper, toaster) {

  // Public API here
  return {
    /**
     * Loads a single entity
     * 
     * @param uri
     * @returns {Promise | Summary object}
     */
    load: function (uri) {
      return $http.get(Uris.JSON_ROOT + 'compoundObject/id?ID=' + encodeURIComponent(uri)).then(function (response) {
        var compoundObject = {
            uri: uri,
            jsonData: response.data
        };
        return compoundObject;
      });
    },

    loadAll: function () {
      return $http.get('resources/compoundObject.json').then(function (response) {
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
        console.log('loading for user');
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
        toaster.pop('success', 'Successfully updated.');
        return response.data;
      }, function () {
        toaster.pop('error', 'Error occured.', 'Sorry, we save at this time');
      });
    },

    delete: function (uri) {
      return $http.delete(Uris.JSON_ROOT + 'compoundObject?ID=' + encodeURIComponent(uri)).then(function (response) {
        toaster.pop('success', 'Successfully deleted.');
        return response.data;
      }, function () {
        toaster.pop('error', 'Error occured.', 'Sorry, we save at this time');
      });

    }
  };
});