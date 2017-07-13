'use strict';

angular.module('qldarchApp').controller('ArchObjArticlesCtrl', function($scope, articles, $filter) {
  /* globals _:false */
  articles = $filter('filter')(articles, function(article) {
    return article.type === 'article' || article.type === 'Article';
  });

  articles = $filter('orderBy')(articles, function(article) {
    return (article.category === 'archobj' || article.label || '');
  });

  articles = _.uniqBy(articles, 'label');

  $scope.articles = articles;
});
