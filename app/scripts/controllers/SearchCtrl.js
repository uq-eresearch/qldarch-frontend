'use strict';

angular.module('qldarchApp').controller('SearchCtrl', function($scope, $location, $http, Uris) {

  function activate() {
    $scope.query = $location.search().query;
    $http.get(Uris.WS_ROOT + 'search?q=' + $scope.query + '&p=0&pc=20').then(function(response) {
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
});