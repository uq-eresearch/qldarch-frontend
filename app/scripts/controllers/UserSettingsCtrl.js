'use strict';

angular.module('qldarchApp').controller('UserSettingsCtrl', function($scope, Auth, toaster, Uris, $http, $state) {
  $scope.user = {};
  $scope.user.username = Auth.user.username;
  $scope.user.email = Auth.user.email;

  $scope.update = function() {
    $scope.user.username = Auth.user.username;
    $scope.user.email = Auth.user.email;

    $http.put(Uris.JSON_ROOT + 'user', jQuery.param($scope.user), {
      headers : {
        'Content-Type' : 'application/x-www-form-urlencoded'
      }
    }).then(function() {
      // User saved
      $state.go('main');
      toaster.pop('success', 'Password Updated', 'You have successfully updated your password.');
    }, function() {
      toaster.pop('error', 'Error occured.', 'Sorry, we couldn\t update your password at this time');
    });
  };
});