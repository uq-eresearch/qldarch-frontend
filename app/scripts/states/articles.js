'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('articles', {
    url : '/articles',
    templateUrl : 'views/articles.html',
    resolve : {
      // @todo: change this for building
      articles : [ 'Expression', function(Expression) {
        return Expression.loadAll('qldarch:Article');
      } ]
    },
    controller : [ '$scope', 'articles', function($scope, articles) {
      $scope.articles = articles;
    } ]
  });
});