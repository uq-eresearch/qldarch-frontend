'use strict';

angular.module('qldarchApp').controller('AdminUsersCtrl', function($scope, users, $http, Uris) {
  $scope.users = users;

  $scope.saveUser = function(user) {
    user.$isSaving = true;
    console.log('user is', user);
    $http.post(Uris.WS_ROOT + 'account/update/' + user.id, jQuery.param({
      role : user.role,
      contact : user.contact
    }), {
      headers : {
        'Content-Type' : 'application/x-www-form-urlencoded'
      }
    }).then(function(response) {
      console.log('response', response);
      user.$isSaving = false;
      user.$isChanged = false;
    });
  };
});