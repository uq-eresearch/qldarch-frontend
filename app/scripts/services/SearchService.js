(function() {
  'use strict';

  /* @ngInject */
  function SearchService($http) {
    function getArticles(name) {
      return $http.get('/ws/search?q=' + name + ' type:article&p=0&pc=20').then(function(response) {
        /* globals _:false */
        return _.map(response.data.documents, function(article) {
          return _.assign({}, article, {
            encodedUri : btoa(article.uri)
          });
        });
      });
    }

    function getArticlesInterviews(query) {
      return $http.get('/ws/search?q=' + query + '&p=0&pc=20').then(function(response) {
        var data = response.data.documents;
        var documents = [];
        /* globals $:false */
        $.each(data, function(i, item) {
          if (item.type === 'article' || item.type === 'interview') {
            var path;
            if (item.type === 'article') {
              path = '/article?articleId=';
            } else if (item.type === 'interview') {
              path = '/interview/';
            }
            data[i].$link = path + btoa(item.uri);
            documents.push(data[i]);
          }
        });
        return documents;
      });
    }

    var service = {
      getArticles : getArticles,
      getArticlesInterviews : getArticlesInterviews
    };

    return service;
  }

  angular.module('qldarchApp').factory('SearchService', SearchService);

})();