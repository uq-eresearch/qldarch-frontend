'use strict';

angular.module('qldarchApp').controller('UserFilesCtrl', function($scope, $filter, mediaimages, LayoutHelper) {
  var DEFAULT_IMAGE_ROW_COUNT = 5;
  $scope.imageRowDisplayCount = DEFAULT_IMAGE_ROW_COUNT;

  mediaimages = $filter('orderBy')(mediaimages, function(mediaimage) {
    return mediaimage.label;
  });

  $scope.mediaimageRows = LayoutHelper.group(mediaimages, 6);

  $scope.addMoreImageRows = function() {
    $scope.imageRowDisplayCount += 5;
  };
});