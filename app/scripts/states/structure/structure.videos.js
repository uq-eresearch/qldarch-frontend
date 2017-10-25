'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('structure.videos', {
    url : '/videos',
    templateUrl : 'views/structure/videos.html',
    resolve : {
      videos : [ 'structure', '$filter', function(structure, $filter) {
        return $filter('filter')(structure.media, function(media) {
          return (media.type === 'Video');
        });
      } ]
    },
    controller : [ '$scope', 'videos', 'LayoutHelper', function($scope, videos, LayoutHelper) {
      $scope.videosRows = LayoutHelper.group(videos, 6);
    } ]
  });
});