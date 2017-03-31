'use strict';

angular.module('qldarchApp').config(
    function($stateProvider) {
      $stateProvider.state('user.files.images', {
        url : '/images',
        resolve : {},
        controller : 'UserFilesCtrl',
        templateUrl : 'views/user.files.images.html'
      });
    });