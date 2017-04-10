'use strict';

angular.module('qldarchApp').controller('UserFilesInterviewsCtrl', function($scope, $filter, mediainterviews) {
  mediainterviews = $filter('orderBy')(mediainterviews, function(mediainterview) {
    return mediainterview.label;
  });
  $scope.mediainterviews = mediainterviews;
});