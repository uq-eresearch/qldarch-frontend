'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('compound', {
    url : '/compound',
    templateUrl : 'views/compound.html'
  });
});