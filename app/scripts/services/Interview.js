'use strict';

angular.module('qldarchApp').factory('Interview', function(Expression, Uris, GraphHelper, Entity, Relationship, Request) {
  // Service logic
  var addArchitectsToInterviews = function(interviews) {

    // Get all the interviewees
    var interviewParticipants = GraphHelper.getAttributeValuesUnique(interviews, [ Uris.QA_INTERVIEWEE, Uris.QA_INTERVIEWER ]);

    return Entity.loadList(interviewParticipants, true).then(function(participants) {
      // Load
      angular.forEach(interviews, function(interview) {
        interview.interviewees = [];
        interview.interviewers = [];
        if (angular.isDefined(interview[Uris.QA_INTERVIEWEE])) {
          var intervieweesUris = GraphHelper.asArray(interview[Uris.QA_INTERVIEWEE]);

          angular.forEach(intervieweesUris, function(intervieweeUri) {
            interview.interviewees.push(participants[intervieweeUri]);
          });
        }
        if (angular.isDefined(interview[Uris.QA_INTERVIEWER])) {
          var interviewersUris = GraphHelper.asArray(interview[Uris.QA_INTERVIEWER]);

          angular.forEach(interviewersUris, function(interviewUri) {
            interview.interviewers.push(participants[interviewUri]);
          });
        }
        interview.$interviewers = interview.interviewers;
        interview.$interviewees = interview.interviewees;
      });
      console.log('interviews', interviews);
      return interviews;
    });
  };

  // Public API here
  return {
    /**
     * Loads a single Architect
     * 
     * @param uri
     * @returns {Promise | Object}
     */
    load : function(uri) {
      return Expression.load(uri, 'qldarch:Interview').then(function(interview) {
        return addArchitectsToInterviews([ interview ]).then(function(interviews) {

          var interview = interviews[0];

          return interview;
        });
      });
    },

    /**
     * Loads all the entities of a certain type
     * 
     * @returns {Promise | Object} All architects
     */
    loadAll : function() {
      return Expression.loadAll('qldarch:Interview').then(function(interviews) {
        console.log('loading all interviews');
        return addArchitectsToInterviews(interviews);
      });
    },

    /**
     * Loads a list of entities
     * 
     * @param uris
     * @returns {Promise| Object} All architects with uris
     */
    loadList : function(uris) {
      return Expression.loadList(uris, 'qldarch:Interview').then(function(interviews) {
        // Format architect
        return addArchitectsToInterviews(interviews);
      });
    },

    findByIntervieweeUri : function(intervieweeUri) {
      return Expression.loadAll('qldarch:Interview').then(function(interviews) {

        // Get the ones with this interviewee
        var filteredInterviews = [];
        angular.forEach(interviews, function(interview) {
          angular.forEach(GraphHelper.asArray(interview[Uris.QA_INTERVIEWEE]), function(searchIntervieweeUri) {
            if (searchIntervieweeUri === intervieweeUri) {
              filteredInterviews.push(interview);
            }
          });
        });
        return addArchitectsToInterviews(filteredInterviews);
      });
    },
    /**
     * Finds all the interviews that mention a uri
     */
    findByMentionedUri : function(mentionedUri) {
      return Relationship.findByEntityUri(mentionedUri).then(function(relationships) {

        // Get out all the evidence uris
        var evidences = GraphHelper.getAttributeValuesUnique(relationships, Uris.QA_EVIDENCE);

        // Get all the evidences so we can read their interview property
        return Request.getIndexForUris('annotation/evidence', evidences).then(function(evidences) {
          // Get all the interviews
          var interviews = GraphHelper.getAttributeValuesUnique(evidences, Uris.QA_DOCUMENTED_BY);
          return Expression.loadList(interviews, 'qldarch:Interview').then(function(interviews) {
            var otherInterviews = [];
            angular.forEach(interviews, function(interview) {
              angular.forEach(GraphHelper.asArray(interview[Uris.QA_INTERVIEWEE]), function(searchIntervieweeUri) {
                if (searchIntervieweeUri === mentionedUri) {
                  otherInterviews.push(interview);
                }
              });
            });
            return addArchitectsToInterviews(otherInterviews);
          });
        });
      });
    }
  };
});