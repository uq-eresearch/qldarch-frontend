'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('articles', {
    url : '/articles',
    templateUrl : 'views/articles.html',
    resolve : {
      articles : [ '$http', 'Uris', function($http, Uris) {
        return $http.get(Uris.WS_ROOT + 'articles').then(function(result) {
          return result.data;
        });
      } ]
    },
    controller : [ '$scope', 'articles', function($scope, articles) {
      $scope.articles = articles;
    } ]
  });
});