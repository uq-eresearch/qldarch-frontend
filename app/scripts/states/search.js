'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('search', {
    url : '/search?query',
    templateUrl : 'views/search.html',
    controller : 'SearchCtrl'
  });
});