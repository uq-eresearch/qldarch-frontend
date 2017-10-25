'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('firm.videos', {
    url : '/videos',
    templateUrl : 'views/firm/videos.html',
    resolve : {
      videos : [ 'firm', '$filter', function(firm, $filter) {
        return $filter('filter')(firm.media, function(media) {
          return (media.type === 'Video');
        });
      } ]
    },
    controller : [ '$scope', 'videos', 'LayoutHelper', function($scope, videos, LayoutHelper) {
      $scope.videosRows = LayoutHelper.group(videos, 6);
    } ]
  });
});