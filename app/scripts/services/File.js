'use strict';

angular.module('qldarchApp').factory('File', function(Uris, $upload, $http, toaster) {
  /* globals $:false */
  var path = Uris.WS_ROOT + 'media/';

  // Public API here
  return {
    upload : function(data, file) {
      return $upload.upload({
        url : path + 'upload',
        data : data,
        file : file,
        withCredentials : true
      });
    },

    update : function(data) {
      var payload = angular.copy(data);
      if (!(payload.created instanceof Date)) {
        payload.created = new Date(payload.created);
      }
      var date = '0' + payload.created.getDate();
      var month = '0' + (payload.created.getMonth() + 1);
      var year = payload.created.getFullYear();
      if (!(isNaN(date) || isNaN(month) || isNaN(year))) {
        var fixedDate = year + '-' + month + '-' + date;
        payload.created = fixedDate;
      } else {
        delete payload.created;
      }
      if (payload.$type.id !== null && angular.isDefined(payload.$type.id)) {
        payload.type = payload.$type.id;
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
        toaster.pop('success', 'media id: ' + data.id + ' updated.');
        console.log('updated media id:' + data.id);
        return data;
      }, function() {
        toaster.pop('error', 'Error occured.', 'Sorry, we save at this time');
      });
    },

    preferred : function(id) {
      return $http.post(path + 'prefer/' + id, {
        withCredentials : true
      }).then(function(response) {
        toaster.pop('success', 'media id: ' + id + ' preferred.');
        console.log('preferred media id:' + id);
        return response.data;
      });
    },

    delete : function(id) {
      return $http.delete(path + id, {
        withCredentials : true
      }).then(function(response) {
        toaster.pop('success', 'media id: ' + id + ' deleted.');
        console.log('deleted media id:' + id);
        return response.data;
      });
    }
  };
});