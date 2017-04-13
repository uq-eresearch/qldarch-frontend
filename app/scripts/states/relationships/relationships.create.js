'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('realtionships.create', {
    url : '/create',
    templateUrl : 'views/relationships/create.html',
    controller : 'RelationshipsCreateCtrl'
  });
});