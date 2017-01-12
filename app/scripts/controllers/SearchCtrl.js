'use strict';

angular.module('qldarchApp').controller('SearchCtrl', function($scope, $location, $http, Uris) {

  function activate() {
    $scope.query = $location.search().query;
    $http.get('/ws/search?q=' + $scope.query + '&p=0&pc=20').then(function(response) {
      var data = response.data.documents;
      /* globals $:false */
      $.each(data, function(i, item) {
        var path;
        if (item.type === 'person') {
          path = '/architect/summary?architectId=';
        } else if (item.type === 'firm') {
          path = '/firm/summary?firmId=';
        } else if (item.type === 'structure') {
          path = '/project/summary?structureId=';
        } else if (item.type === 'article') {
          path = '/article?articleId=';
        } else if (item.type === 'interview') {
          path = '/interview/';
        }
        data[i].link = path + btoa(item.uri);
        if (item.hasOwnProperty('image')) {
          if (item.image.indexOf('amuys/amuys') !== -1) {
            data[i].image = Uris.SESAME_THUMB_ROOT + item.image;
          } else {
            data[i].image = Uris.OMEKA_THUMB_ROOT + item.image;
          }
        }
      });
      $scope.results = data;
    });
  }

  activate();
});