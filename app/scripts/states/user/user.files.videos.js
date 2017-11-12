'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('user.files.videos', {
    url : '/videos',
    resolve : {
      mediavideos : [ 'mediaowned', '$filter', function(mediaowned, $filter) {
        return $filter('filter')(mediaowned, function(med) {
          return med.type === 'Video';
        });
      } ]
    },
    controller : 'UserFilesVideosCtrl',
    templateUrl : 'views/user/user.files.videos.html'
  });
});