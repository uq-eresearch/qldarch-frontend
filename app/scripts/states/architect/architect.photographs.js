'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('architect.photographs', {
    url : '/photographs',
    templateUrl : 'views/architect/photographs.html',
    resolve : {
      photographs : [ 'architect', '$filter', function(architect, $filter) {
        return $filter('filter')(architect.media, function(media) {
          return (media.type === 'Photograph' || media.type === 'Portrait' || media.type === 'Image');
        });
      } ]
    },
    controller : [ '$scope', 'photographs', 'LayoutHelper', function($scope, photographs, LayoutHelper) {
      $scope.photographRows = LayoutHelper.group(photographs, 6);
    } ]
  });
});