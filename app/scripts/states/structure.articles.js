'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('structure.articles', {
    url : '/articles',
    templateUrl : 'views/architect/articles.html',
    resolve : {
      articles : [ 'SearchService', 'structure', function(SearchService, structure) {
        return SearchService.getArticles(structure.name);
      } ]
    },
    controller : [ '$scope', 'articles', function($scope, articles) {
      $scope.articles = articles;
    } ]
  });
});