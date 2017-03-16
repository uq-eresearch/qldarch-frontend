'use strict';

angular.module('qldarchApp').service('ImageTypes', function ImageTypes() {
  return {
    'Image' : 'Image',
    'LineDrawing' : 'Line Drawing',
    'Photograph' : 'Photograph',
    'Portrait' : 'Portrait'
  };
});