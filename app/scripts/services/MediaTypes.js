'use strict';

angular.module('qldarchApp').service('MediaTypes', function MediaTypes() {
  return {
    'Article' : 'Article',
    'Audio' : 'Audio',
    // 'Image' : 'Image',
    'LineDrawing' : 'Line Drawing',
    'Photograph' : 'Photograph',
    'Portrait' : 'Portrait',
    'Spreadsheet' : 'Spreadsheet',
    // 'Text' : 'Text',
    'Transcript' : 'Transcript',
    'Video' : 'Video'// ,'Youtube' : 'Youtube'
  };
});