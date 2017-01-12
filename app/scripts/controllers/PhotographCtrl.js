'use strict';

angular.module('qldarchApp').controller('PhotographCtrl', function ($scope, photograph, Expression, $state) {
  $scope.photograph = photograph;
  $scope.delete = function (photograph) {
    Expression.delete(photograph.uri, photograph).then(function () {
      $state.go(photograph.$state + 's', {});
    });
  };
});