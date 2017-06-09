'use strict';

angular.module('qldarchApp').factory('CompObj', function($http, $cacheFactory, Uris, RelationshipLabels, toaster) {
  /* globals $:false */
  var path = Uris.WS_ROOT + 'compobj/';

  // Public API here
  var compobj = {
    create : function(data) {
      var payload = angular.copy(data);
      return $http({
        method : 'PUT',
        url : path,
        headers : {
          'Content-Type' : 'application/x-www-form-urlencoded'
        },
        withCredentials : true,
        transformRequest : function(obj) {
          return $.param(obj, true);
        },
        data : payload
      }).then(function(response) {
        angular.extend(data, response.data);
        toaster.pop('success', data.label + ' created');
        console.log('created compound object id: ' + data.id);
        return data;
      }, function(response) {
        toaster.pop('error', 'Error occured', response.data.msg);
        console.log('error message: ' + response.data.msg);
      });
    },

    delete : function(id) {
      return $http.delete(path + id, {
        withCredentials : true
      }).then(function(response) {
        toaster.pop('success', 'Compound object deleted');
        console.log('deleted compound object id: ' + response.data.id);
        return response.data;
      }, function(response) {
        toaster.pop('error', 'Error occured', response.data.msg);
        console.log('error message: ' + response.data.msg);
      });
    },

    loadAll : function() {
      return $http.get(Uris.WS_ROOT + 'compobjs/all').then(function(result) {
        console.log('load all compound objects');
        return result.data;
      }, function(response) {
        toaster.pop('error', 'Error occured', response.data.msg);
        console.log('error message: ' + response.data.msg);
      });
    },

    load : function(id) {
      return $http.get(path + id).then(function(result) {
        console.log('load compound object id: ' + id);
        return result.data;
      }, function(response) {
        toaster.pop('error', 'Error occured', response.data.msg);
        console.log('error message: ' + response.data.msg);
      });
    }
  };

  return compobj;
});