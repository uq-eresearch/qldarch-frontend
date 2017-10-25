'use strict';

angular.module('qldarchApp').controller('VideoCtrl', function($stateParams, $scope, $filter, video, videos, depicts, $state, File) {

  $scope.video = video;
  videos = $filter('orderBy')(videos, function(vid) {
    return (vid.preferred || '');
  }, true);
  $scope.videos = videos;
  $scope.depicts = depicts;

  function goToVideos() {
    var params = {};
    if ($stateParams.archobjType === 'person') {
      params.architectId = $stateParams.archobjId;
      $state.go('architect.videos', params);
    } else if ($stateParams.archobjType === 'firm') {
      params.firmId = $stateParams.archobjId;
      $state.go('firm.videos', params);
    } else if ($stateParams.archobjType === 'structure') {
      params.structureId = $stateParams.archobjId;
      $state.go('structure.videos', params);
    } else {
      $state.go('user.files.videos');
    }
  }

  // Work out index
  angular.forEach($scope.videos, function(myVideo, myIndex) {
    if (myVideo.id === $scope.video.id) {
      $scope.index = myIndex;
    }
  });

  $scope.next = function() {
    // Go to the next one
    var nextVideoIndex = ($scope.index + 1) % $scope.videos.length;
    var nextVideo = $scope.videos[nextVideoIndex];
    $state.go('video.view', {
      videoId : nextVideo.id
    });
  };
  $scope.prev = function() {
    // Go to the previous one
    var prevVideoIndex = ($scope.index - 1) % $scope.videos.length;
    var prevVideo = $scope.videos[prevVideoIndex];
    $state.go('video.view', {
      videoId : prevVideo.id
    });
  };

  $scope.delete = function(data) {
    var r = window.confirm('Delete video ' + data.filename + '?');
    if (r === true) {
      File.delete(data.id).then(function() {
        goToVideos();
      });
    }
  };

  $scope.updateVideo = function(data) {
    if (data.id) {
      File.update(data).then(function() {
        $state.go('video.view', {
          videoId : data.id
        });
      }).catch(function() {
        $state.go('user.files.videos');
      });
    }
  };

  $scope.cancel = function() {
    if (video.id) {
      $state.go('video.view', {
        videoId : video.id
      });
    } else {
      $state.go('user.files.videos');
    }
  };
});