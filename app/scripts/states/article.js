'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('article', {
    url : '/article?articleId',
    templateUrl : 'views/article.html',
    resolve : {
      // @todo: change this for building
      article : [ 'Expression', 'GraphHelper', '$stateParams', function(Expression, GraphHelper, $stateParams) {
        console.log('loading article');
        var articleUri = GraphHelper.decodeUriString($stateParams.articleId);
        console.log('loading article', articleUri);
        return Expression.load(articleUri, 'qldarch:Article');
      } ]
    },
    controller : 'ArticleCtrl'
  });
});