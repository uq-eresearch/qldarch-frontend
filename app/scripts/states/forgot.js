'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('forgot', {
    url : '/forgot',
    templateUrl : 'views/forgot.html',
    controller : [ '$scope', '$http', 'Uris', function($scope, $http, Uris) {
      $scope.reset = function(credentials) {
        $scope.isResetting = true;
        // todo: this requires a new backend service
        $http.get(Uris.WS_ROOT + 'user/forgotPassword?username=' + encodeURIComponent(credentials.username)).then(function() {
          $scope.isReset = true;
        });
      };
    } ]
  });
});