'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('map.edit.add', {
    abstract : true,
    url : '/add'
  });
});