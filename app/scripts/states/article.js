'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('article', {
    url : '/article?articleId',
    templateUrl : 'views/article.html',
    resolve : {
      article : [ '$stateParams', '$http', 'Uris', function($stateParams, $http, Uris) {
        return $http.get(Uris.WS_ROOT + 'archobj/' + $stateParams.articleId).then(function(result) {
          return result.data;

        });
      } ]
    },
    controller : 'ArticleCtrl'
  });
});