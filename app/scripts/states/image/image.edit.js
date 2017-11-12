'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('image.edit', {
    url : '/edit',
    templateUrl : 'views/image/image.edit.html'
  });
});