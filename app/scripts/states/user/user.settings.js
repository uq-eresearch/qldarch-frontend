'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('user.settings', {
    url : '/settings',
    controller : 'UserSettingsCtrl',
    templateUrl : 'views/user.settings.html'
  });
});