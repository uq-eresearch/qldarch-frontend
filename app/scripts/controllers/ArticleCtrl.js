'use strict';

angular.module('qldarchApp').controller('ArticleCtrl', function($scope, article, ArchObj, $state) {
  $scope.article = article;

  $scope.delete = function(article) {
    var r = window.confirm('Delete article ' + article.label + '?');
    if (r === true) {
      ArchObj.delete(article.id).then(function() {
        $state.go('articles');
      });
    }
  };

  $scope.cancel = function(article) {
    $state.go('article', {
      articleId : article.id
    });
  };

  $scope.updateArticle = function(data) {
    if (data.id) {
      ArchObj.updateArticle(data).then(function() {
        $state.go('article', {
          articleId : data.id
        });
      }).catch(function(error) {
        console.log('Failed to save', error);
        $state.go('article.edit', {
          articleId : data.id
        });
      });
    } else {
      ArchObj.createArticle(data).then(function(response) {
        $state.go('article', {
          articleId : response.id
        });
      }).catch(function(error) {
        console.log('Failed to save', error);
        $state.go('article.edit', {
          articleId : data.id
        });
      });
    }
  };
});