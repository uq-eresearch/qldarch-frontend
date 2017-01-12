'use strict';

angular.module('qldarchApp').factory('Annotation', function(Request, Uris) {

  // Public API here
  return {
    findForInterviewUri : function(interviewUri) {
      return Request.http(Uris.JSON_ROOT + 'annotation', {
        'RESOURCE' : interviewUri,
        'TIME' : 0,
        'DURATION' : '99999'
      }).then(function(annotations) {
        console.log('annotations', annotations);
        // Setup the subject, predicate, objects
      });
    }
  };
});