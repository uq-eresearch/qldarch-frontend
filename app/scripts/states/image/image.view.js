'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('image.view', {
    url : '/view',
    templateUrl : 'views/image.view.html'
  });
});