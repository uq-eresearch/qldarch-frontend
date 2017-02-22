'use strict';

angular.module('qldarchApp').controller('LogoutCtrl', function($scope, $http, Uris, Auth, $state) {
  $http.post(Uris.WS_ROOT + 'signout').then(function(response) {
    Auth.clear();
    angular.extend(Auth, response.data);
    $state.go('main');
  });
});