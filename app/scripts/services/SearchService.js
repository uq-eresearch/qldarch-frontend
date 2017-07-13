(function() {
  'use strict';

  /* @ngInject */
  function SearchService($http, Uris, WordService) {
    function getArticles(query) {
      var syntax = '* AND (type:article OR type:Article) AND (category:archobj OR category:media)';
      return $http.get(Uris.WS_ROOT + 'search?q=' + query.replace(WordService.spclCharsLucene, '') + syntax + '&p=0&pc=20').then(function(response) {
        /* globals _:false */
        return _.map(response.data.documents, function(article) {
          return _.assign({}, article, {
            id : article.id
          });
        });
      });
    }

    function getArticlesInterviews(query) {
      var syntax = '* AND (type:article OR type:interview) AND category:archobj';
      return $http.get(Uris.WS_ROOT + 'search?q=' + query.replace(WordService.spclCharsLucene, '') + syntax + '&p=0&pc=20').then(function(response) {
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
            data[i].$link = path + item.id;
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