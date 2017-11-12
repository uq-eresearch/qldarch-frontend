'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('video.view', {
    url : '/view',
    templateUrl : 'views/video/video.view.html'
  });
});