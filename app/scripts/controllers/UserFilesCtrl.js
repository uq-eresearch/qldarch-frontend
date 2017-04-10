'use strict';

angular.module('qldarchApp').controller('UserFilesCtrl', function($scope, $filter, mediaimages, LayoutHelper) {
  mediaimages = $filter('orderBy')(mediaimages, function(mediaimage) {
    return mediaimage.label;
  });
  $scope.mediaimageRows = LayoutHelper.group(mediaimages, 6);
});