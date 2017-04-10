'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('image', {
    abstract : true,
    url : '/image?imageId&archobjId&archobjType',
    resolve : {
      depicts : [ '$stateParams', 'ArchObj', function($stateParams, ArchObj) {
        return ArchObj.load($stateParams.archobjId).then(function(data) {
          return data;
        });
      } ],
      images : [ 'depicts', '$filter', function(depicts, $filter) {
        return $filter('filter')(depicts.media, function(media) {
          return media.type === ('Photograph' || 'Portrait' || 'Image' || 'LineDrawing');
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