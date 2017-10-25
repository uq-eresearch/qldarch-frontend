'use strict';

angular.module('qldarchApp').controller('UserFilesVideosCtrl', function($scope, $filter, mediavideos, LayoutHelper) {
  var DEFAULT_VIDEO_ROW_COUNT = 5;
  $scope.videoRowDisplayCount = DEFAULT_VIDEO_ROW_COUNT;

  mediavideos = $filter('orderBy')(mediavideos, function(mediavideo) {
    return mediavideo.label;
  });

  $scope.mediavideoRows = LayoutHelper.group(mediavideos, 6);

  $scope.addMoreVideoRows = function() {
    $scope.videoRowDisplayCount += 5;
  };
});