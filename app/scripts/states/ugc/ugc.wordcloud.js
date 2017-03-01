'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('ugc.wordcloud', {
    url : '/wordcloud',
    views : {
      header : {
        templateUrl : 'views/ugc/wordcloud.header.html'
      },
      builder : {
        template : ''
      },
      viewer : {
        templateUrl : 'views/ugc/wordcloud.viewer.html',
        controller : 'WordCloudViewerCtrl'
      }
    }
  });
});