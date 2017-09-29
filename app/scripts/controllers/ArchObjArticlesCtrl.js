'use strict';

angular.module('qldarchApp').controller('ArchObjArticlesCtrl', function($scope, articles, $filter) {

  articles = $filter('filter')(articles, function(article) {
    return article.type === 'article' || article.type === 'Article';
  });

  articles = $filter('orderBy')(articles, function(article) {
    return (article.category === 'archobj' || '');
  });

  articles = $filter('orderBy')(articles, function(article) {
    return (article.label || article.filename || '');
  });

  var archobjarticles = $filter('filter')(articles, function(article) {
    return article.type === 'article';
  });

  var duplicate = [];
  angular.forEach(articles, function(article, index) {
    angular.forEach(archobjarticles, function(archobjarticle) {
      if (angular.isDefined(article.depicts) && article.depicts === archobjarticle.id) {
        duplicate.push(index);
      }
    });
  });
  angular.forEach(duplicate, function(d, i) {
    articles.splice(d - i, 1);
  });

  $scope.articles = articles;
});
