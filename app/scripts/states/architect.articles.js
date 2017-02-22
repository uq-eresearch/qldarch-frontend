'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('architect.articles', {
    url : '/articles',
    templateUrl : 'views/architect/articles.html',
    controller : 'ArchitectArticlesCtrl',
    resolve : {
      articles : [ 'SearchService', 'architect', function(SearchService, architect) {
        return SearchService.getArticles(architect.label);
      } ]
    }
  });
});