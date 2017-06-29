'use strict';

angular.module('qldarchApp').controller('ArchObjArticlesCtrl', function($scope, articles, $filter) {
  articles = $filter('filter')(articles, function(article) {
    return article.type === 'article' || article.type === 'Article';
  });

  $scope.articles = articles;
});
