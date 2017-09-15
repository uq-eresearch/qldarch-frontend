(function() {
  'use strict';

  /* @ngInject */
  function SearchService($http, Uris, WordService) {
    /* globals _:false */
    /* globals $:false */
    function getArticles(query) {
      var syntax = '* AND (type:article OR type:Article) AND (category:archobj OR category:media)';
      var url = Uris.WS_ROOT + 'search?q=' + query.replace(WordService.spclCharsLucene, '') + syntax + '&p=0';
      return $http.get(url).then(function(resp) {
        return $http.get(url + '&pc=' + resp.data.hits).then(function(response) {
          return _.map(response.data.documents, function(article) {
            return _.assign({}, article, {
              id : article.id
            });
          });
        });
      });
    }

    function getArticlesInterviews(query) {
      var syntax = '* AND (type:article OR type:interview) AND category:archobj';
      var url = Uris.WS_ROOT + 'search?q=' + query.replace(WordService.spclCharsLucene, '') + syntax + '&p=0';
      return $http.get(url).then(function(resp) {
        return $http.get(url + '&pc=' + resp.data.hits).then(function(response) {
          var data = response.data.documents;
          var documents = [];
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