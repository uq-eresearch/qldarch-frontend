'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('user.files.interviews', {
    url : '/interviews',
    resolve : {},
    controller : 'UserFilesInterviewsCtrl',
    templateUrl : 'views/user.files.interviews.html'
  });
});