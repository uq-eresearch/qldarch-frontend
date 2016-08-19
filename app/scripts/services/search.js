(function () {
    'use strict';

    angular
        .module('angularApp')
        .factory('searchService', searchService);

    /* @ngInject */
    function searchService($http) {
        var service = {
            getArticles: getArticles
        };

        return service;

        ////////////////

        function getArticles(name) {
            return $http.get('/ws/search?q=' + name + ' type:article&p=0&pc=20').then(function (response) {
                return _.map(response.data.documents, function(article) {
                    return _.assign({}, article, {
                        encodedUri: btoa(article.uri)
                    });
                });
            });
        }


    }

})();
