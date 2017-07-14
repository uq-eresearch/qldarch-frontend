'use strict';

angular.module('qldarchApp').controller('SearchCtrl',
    function($scope, $location, $http, Uris, WordService, architects, firms, structures, personnotarchitect, othersnotperson) {

      $scope.page = 0;
      var pagecount = 20;

      function activate() {
        $scope.query = $location.search().query;
        var query = ($scope.query).replace(WordService.spclCharsLucene, '');
        var syntax = '*';
        $http.get(Uris.WS_ROOT + 'search?q=' + query + syntax + '&p=' + $scope.page + '&pc=' + pagecount).then(function(response) {
          $scope.maxPages = Math.round(response.data.hits / pagecount) - 1;
          var data = response.data.documents;
          /* globals $:false */
          $.each(data, function(i, item) {
            var path;
            if (item.type === 'person' && item.architect === true) {
              path = '/architect/summary?architectId=';
              angular.forEach(architects, function(architect) {
                if (item.id === architect.id) {
                  if (angular.isDefined(architect.media)) {
                    data[i].media = architect.media;
                  }
                }
              });
            } else if (item.type === 'person' && item.architect === false) {
              path = '/other/summary?otherId=';
              angular.forEach(personnotarchitect, function(person) {
                if (item.id === person.id) {
                  if (angular.isDefined(person.media)) {
                    data[i].media = person.media;
                  }
                }
              });
            } else if (item.type === 'firm') {
              path = '/firm/summary?firmId=';
              angular.forEach(firms, function(firm) {
                if (item.id === firm.id) {
                  if (angular.isDefined(firm.media)) {
                    data[i].media = firm.media;
                  }
                }
              });
            } else if (item.type === 'structure') {
              path = '/project/summary?structureId=';
              angular.forEach(structures, function(structure) {
                if (item.id === structure.id) {
                  if (angular.isDefined(structure.media)) {
                    data[i].media = structure.media;
                  }
                }
              });
            } else if (item.type === 'article') {
              path = '/article?articleId=';
            } else if (item.category === 'media') {
              path = '/media/download/';
            } else if (item.type === 'interview') {
              path = '/interview/';
            } else {
              path = '/other/summary?otherId=';
              angular.forEach(othersnotperson, function(other) {
                if (item.id === other.id) {
                  if (angular.isDefined(other.media)) {
                    data[i].media = other.media;
                  }
                }
              });
            }
            data[i].link = path + item.id;
          });
          $scope.results = data;
        });
      }

      activate();

      function scrollToTop() {
        jQuery('html, body').animate({
          scrollTop : 0
        }, 500);
      }

      $scope.nextResultPage = function() {
        $scope.page++;
        activate();
        scrollToTop();
      };

      $scope.prevResultPage = function() {
        $scope.page--;
        activate();
        scrollToTop();
      };

    });