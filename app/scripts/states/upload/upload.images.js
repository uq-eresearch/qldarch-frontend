'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('upload.images', {
    url : '/image',
    templateUrl : 'views/files/photograph.html',
    controller : 'FilePhotographCtrl'
  });
});