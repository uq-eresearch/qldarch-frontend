'use strict';

angular.module('qldarchApp').controller('ArchitectArticlesCtrl', function($scope, articles) {

  function activate() {
    $scope.articles = articles;
  }

  activate();
});
