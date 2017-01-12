'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('user.files', {
    abstract : true,
    url : '/files',
    templateUrl : 'views/user.files.html'
  });
});