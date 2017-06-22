'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('forgot', {
    url : '/forgot',
    templateUrl : 'views/forgot.html',
    controller : [ '$scope', '$http', 'Uris', function($scope, $http, Uris) {
      $scope.reset = function(credentials) {
        $scope.isResetting = true;
        $http.post(Uris.WS_ROOT + 'account/password/reset?email=' + credentials.email).then(function(response) {
          $scope.resetResponse = response.data;
          $scope.isResetting = false;
          $scope.isReset = true;
        }, function(error) {
          if (error.data.length > 100 || error.data.substring(0, 1) === '<') {
            $scope.resetResponse = 'An error or unrecognised email address, please try again';
          } else {
            $scope.resetResponse = error.data;
          }
          $scope.isResetting = false;
          $scope.isReset = false;
        });
      };
    } ]
  });
});