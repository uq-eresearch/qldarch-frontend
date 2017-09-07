'use strict';

angular.module('qldarchApp').controller('AdminSettingsCtrl', function($scope, toaster, Uris, $http, $state) {
  $scope.searchUpdateAll = function() {
    $http({
      method : 'POST',
      url : Uris.WS_ROOT + 'search/updateall',
      headers : {
        'Content-Type' : 'application/x-www-form-urlencoded'
      },
      withCredentials : true
    }).then(function() {
      $state.go('main');
      toaster.pop('success', 'Index Update In Progress', 'You are running search index update');
    }, function() {
      toaster.pop('error', 'Error occured', 'Sorry, we couldn\t update search index');
    });
  };

  $scope.siteMapUpdate = function() {
    $http({
      method : 'POST',
      url : Uris.WS_ROOT + 'sitemap',
      headers : {
        'Content-Type' : 'application/x-www-form-urlencoded'
      },
      withCredentials : true
    }).then(function() {
      $state.go('main');
      toaster.pop('success', 'Sitemap Updated', 'You have update sitemap file');
    }, function() {
      toaster.pop('error', 'Error occured', 'Sorry, we couldn\t update sitemap file');
    });
  };
});