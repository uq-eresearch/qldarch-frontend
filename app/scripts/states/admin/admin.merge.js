'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('admin.merge', {
    url : '/merge',
    controller : 'AdminMergeCtrl',
    templateUrl : 'views/admin/admin.merge.html'
  });
});