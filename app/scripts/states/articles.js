'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('articles', {
    url : '/articles',
    templateUrl : 'views/articles.html',
    resolve : {
      articles : [ 'AggArchObjs', function(AggArchObjs) {
        return AggArchObjs.loadArticles().then(function(data) {
          return data;
        }).catch(function() {
          console.log('unable to load articles');
          return {};
        });
      } ]
    },
    controller : [ '$scope', 'articles', function($scope, articles) {
      $scope.articles = articles;
    } ]
  });
});