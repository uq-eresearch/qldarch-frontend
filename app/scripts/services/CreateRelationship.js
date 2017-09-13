'use strict';

angular.module('qldarchApp').factory('CreateRelationship', function($http, Uris, toaster) {
  /* globals $:false */
  var createrelationship = {
    createRelationship : function(data) {
      var payload = angular.copy(data);
      payload.source = payload.$source;
      payload.type = payload.$type.id;
      payload.subject = payload.$subject.id;
      payload.object = payload.$object.id;
      delete payload.from;
      delete payload.until;
      if (payload.$from !== null && angular.isDefined(payload.$from) && payload.$from !== '') {
        payload.from = payload.$from.getFullYear();
      }
      if (payload.$until !== null && angular.isDefined(payload.$until) && payload.$until !== '') {
        payload.until = payload.$until.getFullYear();
      }
      // Remove any extra information
      delete payload.$source;
      delete payload.$type;
      delete payload.$subject;
      delete payload.$object;
      delete payload.$from;
      delete payload.$until;
      delete payload.id;
      delete payload.owner;
      delete payload.created;
      return $http({
        method : 'PUT',
        url : Uris.WS_ROOT + 'relationship',
        headers : {
          'Content-Type' : 'application/x-www-form-urlencoded'
        },
        withCredentials : true,
        transformRequest : function(obj) {
          return $.param(obj);
        },
        data : payload
      }).then(function(response) {
        angular.extend(data, response.data);
        // toaster.pop('success', 'Relationship added');
        console.log('created relationship id: ' + data.id);
        return data;
      }, function(response) {
        toaster.pop('error', 'Error occured', response.data.msg);
        console.log('error message: ' + response.data.msg);
      });
    }
  };

  return createrelationship;
});