'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('firm.articles', {
    url : '/articles',
    templateUrl : 'views/architect/articles.html',
    resolve : {
      articles : [ 'SearchService', 'firm', function(SearchService, firm) {
        return SearchService.getArticles(firm.label);
      } ]
    },
    controller : [ '$scope', 'articles', function($scope, articles) {
      $scope.articles = articles;
    } ]
  });
});