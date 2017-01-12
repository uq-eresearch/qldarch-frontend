'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('about', {
    url : '/about',
    templateUrl : 'views/about.html'
  });
});