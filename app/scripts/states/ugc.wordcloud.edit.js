'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('ugc.wordcloud.edit', {
    url : '/edit',
    controller : 'CreateMapCtrl',
    reloadOnSearch : false,
    views : {
      'builder@ugc' : {
        templateUrl : 'views/ugc/wordcloud.builder.html',
        controller : 'WordCloudBuilderCtrl'
      }
    }
  });
});