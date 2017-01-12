'use strict';

angular.module('qldarchApp').config(
    function($stateProvider) {
      $stateProvider.state('architect.interview', {
        url : '/interview/:interviewId?time',
        templateUrl : 'views/architect/interview.html',
        controller : 'InterviewCtrl',
        resolve : {
          interview : [ '$http', '$stateParams', '$q', 'Uris', 'Architect', 'Interview', 'Transcript', 'Relationship', 'GraphHelper', 'Entity',
              'Ontology', 'File',
              function($http, $stateParams, $q, Uris, Architect, Interview, Transcript, Relationship, GraphHelper, Entity, Ontology) {
                var interviewUri = atob($stateParams.interviewId);

                // Get all the interview
                return Interview.load(interviewUri).then(function(interview) {

                  var transcriptUrls = GraphHelper.asArray(interview[Uris.QA_TRANSCRIPT_LOCATION]);
                  if (transcriptUrls.length === 0) {
                    console.log('No transcript');
                    return interview;
                  }
                  var transcriptUrl = transcriptUrls[0];
                  console.log('transcript urls', transcriptUrls);

                  console.log('interview is', interview);
                  return Transcript.findFileFromInterviewKludge(interview[Uris.QA_HAS_TRANSCRIPT]).then(function(transcriptFile) {
                    interview.transcriptFile = transcriptFile;
                    if (transcriptFile.file.indexOf('undefined') !== -1) {
                      interview.transcriptFile.file = transcriptUrl;
                      console.log('transcriptFile.file is undefined, override to transcriptUrl');
                    }
                    return Transcript.findWithUrl(transcriptUrl).then(function(transcript) {
                      console.log('transcript file is', transcript);
                      return Relationship.findByInterviewUri(interviewUri).then(function(relationships) {
                        // Get all the subject, object, and predicate data
                        var entities = GraphHelper.getAttributeValuesUnique(relationships, [ Uris.QA_SUBJECT, Uris.QA_OBJECT ]);
                        var relatedRequests = [ Entity.loadList(entities), Ontology.loadAllProperties() ];

                        return $q.all(relatedRequests).then(function(relatedData) {
                          var entities = relatedData[0];
                          var properties = relatedData[1];

                          // Insert that data
                          angular.forEach(relationships, function(relationship) {
                            relationship.subject = entities[relationship[Uris.QA_SUBJECT]];
                            relationship.object = entities[relationship[Uris.QA_OBJECT]];
                            relationship.predicate = properties[relationship[Uris.QA_PREDICATE]];
                          });

                          // Setup the transcript with all this new data
                          interview.transcript = Transcript.setupTranscript(transcript, {
                            interviewers : interview.interviewers,
                            interviewees : interview.interviewees,
                            relationships : relationships
                          });
                          return interview;
                        });
                      });
                    });
                  });
                });
              } ]
        }
      });
    });