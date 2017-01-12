'use strict';

angular.module('qldarchApp').controller('ArticleCtrl', function ($scope, article, Expression, $state) {
  $scope.article = article;
  var originalArticle = angular.copy(article);

  /**
   * Deletes an article
   * 
   * @param {[type]}
   *          article [description]
   * @return {[type]} [description]
   */
  $scope.delete = function (article) {
    Expression.delete(article.uri, article).then(function () {
      // Success
      $state.go('main');
    }, function (reason) {
      // Failure
      console.log('Something went wrong', reason);
    });
  };

  $scope.cancel = function (article) {
    angular.copy(originalArticle, article);
    $state.go('article', {
      articleId: article.encodedUri
    });
  };

  $scope.updateArticle = function (article) {
    if (article.uri) {
      // PUT
      Expression.update(article.uri, article).
      catch (function (error) {
        alert('Failed to save');
        console.log('Failed to save', error);
        $state.go('article.edit', {
          articleId: article.encodedUri
        });
      });
      $state.go('article', {
        articleId: article.encodedUri
      });
    }
  };
});