'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('image', {
    abstract : true,
    url : '/image/:imageId?archobjId',
    resolve : {
      depicts : [ '$stateParams', '$http', 'Uris', function($stateParams, $http, Uris) {
        return $http.get(Uris.WS_ROOT + 'archobj/' + $stateParams.archobjId).then(function(result) {
          return result.data;
        });
      } ],
      images : [ 'depicts', '$filter', function(depicts, $filter) {
        return $filter('filter')(depicts.media, function(media) {
          return media.type === 'Photograph' || 'Portrait' || 'Image';
        });
      } ],
      image : [ 'images', '$stateParams', function(images, $stateParams) {
        var img;
        angular.forEach(images, function(im) {
          if (JSON.stringify(im.id) === $stateParams.imageId) {
            img = im;
          }
        });
        return img;
      } ]
    },
    controller : 'ImageCtrl',
    template : '<ui-view autoscroll="false"></ui-view>'
  });
});