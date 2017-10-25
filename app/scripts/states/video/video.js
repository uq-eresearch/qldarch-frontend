'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('video', {
    abstract : true,
    url : '/video?videoId&archobjId&archobjType',
    resolve : {
      depicts : [ '$stateParams', 'ArchObj', function($stateParams, ArchObj) {
        return ArchObj.load($stateParams.archobjId).then(function(data) {
          return data;
        });
      } ],
      videos : [ 'depicts', '$filter', function(depicts, $filter) {
        return $filter('filter')(depicts.media, function(media) {
          return media.type === 'Video';
        });
      } ],
      video : [ 'videos', '$stateParams', function(videos, $stateParams) {
        var vid;
        angular.forEach(videos, function(vi) {
          if (JSON.stringify(vi.id) === $stateParams.videoId) {
            vid = vi;
          }
        });
        return vid;
      } ]
    },
    controller : 'VideoCtrl',
    template : '<ui-view autoscroll="false"></ui-view>'
  });
});