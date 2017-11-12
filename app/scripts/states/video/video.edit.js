'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('video.edit', {
    url : '/edit',
    templateUrl : 'views/video/video.edit.html'
  });
});