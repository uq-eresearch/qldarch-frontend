'use strict';

angular.module('qldarchApp').controller('RegisterCtrl', function($scope, $http, Uris) {
  $scope.user = {};

  $scope.createUser = function(user) {
    $http.post(Uris.WS_ROOT + 'signup', jQuery.param(user), {
      headers : {
        'Content-Type' : 'application/x-www-form-urlencoded'
      }
    }).then(function(response) {
      console.log('response', response);
      if (response.data.success) {
        $scope.hasRegistered = true;
      }
    });
    $scope.user = {};
  };

});