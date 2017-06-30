'use strict';

angular.module('qldarchApp').controller('SearchCtrl', function($scope, $location, $http, Uris, WordService) {

  $scope.page = 0;
  var pagecount = 20;

  function activate() {
    $scope.query = $location.search().query;
    var query = ($scope.query).replace(WordService.spclCharsLucene, '');
    var syntax = '* AND category:archobj';
    $http.get(Uris.WS_ROOT + 'search?q=' + query + syntax + '&p=' + $scope.page + '&pc=' + pagecount).then(function(response) {
      $scope.maxPages = Math.round(response.data.hits / pagecount) - 1;
      var data = response.data.documents;
      /* globals $:false */
      $.each(data, function(i, item) {
        var path;
        if (item.type === 'person' && item.architect === true) {
          path = '/architect/summary?architectId=';
        } else if (item.type === 'person' && item.architect === false) {
          path = '/other/summary?otherId=';
        } else if (item.type === 'firm') {
          path = '/firm/summary?firmId=';
        } else if (item.type === 'structure') {
          path = '/project/summary?structureId=';
        } else if (item.type === 'article') {
          path = '/article?articleId=';
        } else if (item.type === 'interview') {
          path = '/interview/';
        }
        data[i].link = path + item.id;
      });
      $scope.results = data;
    });
  }

  activate();

  $scope.nextResultPage = function() {
    $scope.page++;
    activate();
    jQuery('html, body').animate({
      scrollTop : 0
    }, 500);
  };

  $scope.prevResultPage = function() {
    $scope.page--;
    activate();
    jQuery('html, body').animate({
      scrollTop : 0
    }, 500);
  };

});