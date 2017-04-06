'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('admin.users', {
    url : '/users',
    resolve : {
      users : [ 'Uris', '$http', 'GraphHelper', function(Uris, $http, GraphHelper) {
        // Gets all users in the system and their roles
        return $http.get(Uris.WS_ROOT + 'accounts/all').then(function(response) {
          return GraphHelper.graphValues(response.data);
        });
      } ]
    },
    controller : 'AdminUsersCtrl',
    templateUrl : 'views/admin/users.html'
  });
});