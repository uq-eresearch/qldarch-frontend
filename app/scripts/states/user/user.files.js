'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('user.files', {
    abstract : true,
    url : '/files',
    resolve : {
      mediaowned : [ 'Uris', '$http', function(Uris, $http) {
        // Gets all files from this user
        return $http.get(Uris.WS_ROOT + 'media/owned', {
          withCredentials : true
        }).then(function(result) {
          console.log('load media owned by current user');
          return result.data;
        });
      } ]
    },
    templateUrl : 'views/user/user.files.html'
  });
});