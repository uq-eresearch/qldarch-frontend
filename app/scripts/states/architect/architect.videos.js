'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('architect.videos', {
    url : '/videos',
    templateUrl : 'views/architect/videos.html',
    resolve : {
      videos : [ 'architect', '$filter', function(architect, $filter) {
        return $filter('filter')(architect.media, function(media) {
          return (media.type === 'Video');
        });
      } ]
    },
    controller : [ '$scope', 'videos', 'LayoutHelper', function($scope, videos, LayoutHelper) {
      $scope.videosRows = LayoutHelper.group(videos, 6);
    } ]
  });
});