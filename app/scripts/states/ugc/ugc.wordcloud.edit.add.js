'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('ugc.wordcloud.edit.add', {
    abstract : true,
    url : '/add'
  });
});