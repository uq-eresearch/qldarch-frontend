'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('forgot', {
    url : '/forgot',
    templateUrl : 'views/forgot.html',
    controller : [ '$scope', '$http', 'Uris', function($scope, $http, Uris) {
      $scope.reset = function(credentials) {
        $scope.isResetting = true;
        $http.get(Uris.JSON_ROOT + 'user/forgotPassword?username=' + encodeURIComponent(credentials.username)).then(function() {
          $scope.isReset = true;
        });
      };
    } ]
  });
});