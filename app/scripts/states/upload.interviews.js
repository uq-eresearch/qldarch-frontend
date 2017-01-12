'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('upload.interviews', {
    url : '/interviews?id',
    resolve : {
      interview : [ 'Uris', '$stateParams', 'GraphHelper', 'Interview', function(Uris, $stateParams, GraphHelper, Interview) {
        if ($stateParams.id) {
          var interviewUri = GraphHelper.decodeUriString($stateParams.id);
          console.log('loading interview');
          return Interview.load(interviewUri);
        } else {
          var interview = {};
          interview[Uris.RDF_TYPE] = Uris.QA_INTERVIEW_TYPE;
          interview[Uris.QA_EXTERNAL_LOCATION] = [];
          interview[Uris.QA_HAS_FILE] = [];
          return interview;
        }
      } ]
    },
    templateUrl : 'views/upload.interviews.html',
    controller : 'UploadInterviewsCtrl'
  });
});