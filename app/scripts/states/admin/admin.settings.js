'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('admin.settings', {
    url : '/settings',
    controller : 'AdminSettingsCtrl',
    templateUrl : 'views/admin/admin.settings.html'
  });
});