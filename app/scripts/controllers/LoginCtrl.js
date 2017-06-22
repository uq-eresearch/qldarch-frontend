'use strict';

angular.module('qldarchApp').controller('LoginCtrl', function($scope, Uris, $http, Auth, $state, toaster) {
  $scope.credentials = {};

  $scope.login = function(credentials) {
    $http.post(Uris.WS_ROOT + 'signin', jQuery.param({
      email : credentials.username,
      password : credentials.password
    }), {
      headers : {
        'Content-Type' : 'application/x-www-form-urlencoded'
      }
    }).then(function(response) {
      if (response.data.success) {
        Auth.clear();
        angular.extend(Auth, response.data);
        console.log('going to main!');
        $state.go('main');
      } else {
        toaster.pop('error', 'Error occured', 'Sorry, that email and/or password is incorrect');
      }
    }, function(error) {
      console.log('failed to log in', error);
    });
  };
});