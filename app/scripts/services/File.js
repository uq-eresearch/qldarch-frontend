'use strict';

angular.module('qldarchApp').factory('File', function(Uris, $upload, $http, toaster, YYYYMMDDdate) {
  /* globals $:false */
  var path = Uris.WS_ROOT + 'media/';

  // Public API here
  return {
    upload : function(data, file) {
      var payload = angular.copy(data);
      payload.created = YYYYMMDDdate.formatDate(payload.created);
      if (payload.created === null) {
        delete payload.created;
      }
      return $upload.upload({
        url : path + 'upload',
        data : payload,
        file : file,
        withCredentials : true
      });
    },

    update : function(data) {
      var payload = angular.copy(data);
      payload.created = YYYYMMDDdate.formatDate(payload.created);
      if (payload.created === null) {
        delete payload.created;
      }
      if (payload.$type !== null && angular.isDefined(payload.$type)) {
        if (payload.$type.id !== null && angular.isDefined(payload.$type.id)) {
          payload.type = payload.$type.id;
        }
      }
      // Remove any extra information
      delete payload.$type;
      delete payload.id;
      delete payload.filename;
      delete payload.mimetype;
      delete payload.filesize;
      delete payload.url;
      delete payload.owner;
      // delete payload.type;
      // delete payload.label;
      // delete payload.description;
      // delete payload.creator;
      // delete payload.created;
      // delete payload.rights;
      // delete payload.identifier;
      return $http({
        method : 'POST',
        url : path + data.id,
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
        toaster.pop('success', data.filename + ' updated');
        console.log('updated media id: ' + data.id);
        return data;
      }, function(response) {
        toaster.pop('error', 'Error occured', response.data.msg);
        console.log('error message: ' + response.data.msg);
      });
    },

    preferred : function(id) {
      return $http.post(path + 'prefer/' + id, {
        withCredentials : true
      }).then(function(response) {
        toaster.pop('success', response.data.filename + ' preferred');
        console.log('preferred media id: ' + response.data.id);
        return response.data;
      }, function(response) {
        toaster.pop('error', 'Error occured', response.data.msg);
        console.log('error message: ' + response.data.msg);
      });
    },

    delete : function(id) {
      return $http.delete(path + id, {
        withCredentials : true
      }).then(function(response) {
        toaster.pop('success', response.data.filename + ' deleted');
        console.log('deleted media id: ' + response.data.id);
        return response.data;
      }, function(response) {
        toaster.pop('error', 'Error occured', response.data.msg);
        console.log('error message: ' + response.data.msg);
      });
    }
  };
});