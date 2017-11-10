'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('articles', {
    url : '/articles?index',
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
    controller : [ '$scope', 'articles', '$stateParams', '$filter', '$state', function($scope, articles, $stateParams, $filter, $state) {
      $scope.articles = articles;
      $scope.$stateParams = $stateParams;
      $scope.indexes = {
        '#' : false,
        'A' : false,
        'B' : false,
        'C' : false,
        'D' : false,
        'E' : false,
        'F' : false,
        'G' : false,
        'H' : false,
        'I' : false,
        'J' : false,
        'K' : false,
        'L' : false,
        'M' : false,
        'N' : false,
        'O' : false,
        'P' : false,
        'Q' : false,
        'R' : false,
        'S' : false,
        'T' : false,
        'U' : false,
        'V' : false,
        'W' : false,
        'X' : false,
        'Y' : false,
        'Z' : false
      };

      function isLetter(char) {
        return char.match(/[a-z]/i);
      }

      $scope.articles = $filter('filter')($scope.articles, function(article) {
        if (angular.isDefined(article.label)) {
          var startLetter = article.label.substring(0, 1).toUpperCase();
          if (/['||"||‘]/.test(startLetter)) {
            startLetter = article.label.substring(1, 2).toUpperCase();
          }
          if (!isNaN(startLetter)) {
            $scope.indexes['#'] = true;
          } else if (isLetter(startLetter)) {
            $scope.indexes[startLetter] = true;
          }
          if ($stateParams.index && $stateParams.index.length === 1) {
            if (!isNaN(startLetter) && '#' === $stateParams.index) {
              return true;
            } else if (isLetter($stateParams.index) && startLetter === $stateParams.index) {
              return true;
            }
            return false;
          }
          return true;
        }
      });

      $scope.articles = $filter('orderBy')($scope.articles, function(article) {
        return article.label;
      });

      $scope.goToIndex = function(index) {
        $state.go($state.current.name, {
          index : index
        });
      };
    } ]
  });
});