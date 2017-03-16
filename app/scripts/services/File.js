'use strict';

angular.module('qldarchApp').factory('File', function(Uris, $upload) {

  // Public API here
  return {
    upload : function(data, file) {
      return $upload.upload({
        url : Uris.WS_ROOT + 'media/upload',
        data : data,
        file : file,
        withCredentials : true
      });
    }
  };
});