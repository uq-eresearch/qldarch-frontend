'use strict';

angular.module('angularApp')
    .factory('Interview', function (Expression, Uris, GraphHelper, Architect, Relationship, Request) {
        // Service logic
        var addArchitectsToInterviews = function (interviews) {

            // Get all the interviewees
            var interviewParticipants = GraphHelper.getAttributeValuesUnique(interviews, [Uris.QA_INTERVIEWEE, Uris.QA_INTERVIEWER]);

            return Architect.loadList(interviewParticipants, true).then(function (participants) {
                // Load
                angular.forEach(interviews, function (interview) {
                    interview.interviewees = [];
                    interview.interviewers = [];
                    if (angular.isDefined(interview[Uris.QA_INTERVIEWEE])) {
                        var intervieweesUris = interview[Uris.QA_INTERVIEWEE];
                        // Insert the interviewee
                        if (!angular.isArray(interview[Uris.QA_INTERVIEWEE])) {
                            intervieweesUris = [interview[Uris.QA_INTERVIEWEE]];
                        }

                        angular.forEach(intervieweesUris, function (intervieweeUri) {
                            interview.interviewees.push(participants[intervieweeUri]);
                        });
                    }
                    if (angular.isDefined(interview[Uris.QA_INTERVIEWER])) {
                        var interviewersUris = interview[Uris.QA_INTERVIEWER];
                        if (!angular.isArray(interview[Uris.QA_INTERVIEWER])) {
                            interviewersUris = [interview[Uris.QA_INTERVIEWER]];
                        }

                        angular.forEach(interviewersUris, function (interviewUri) {
                            interview.interviewers.push(participants[interviewUri]);
                        });
                    }
                });
                return interviews;
            });
        };

        // Public API here
        return {
            /**
             * Loads a single Architect
             * @param uri
             * @returns {Promise | Object}
             */
            load: function (uri, includeTranscript) {
                return Expression.load(uri, 'qldarch:Interview').then(function (interview) {
                    return addArchitectsToInterviews([interview]).then(function (interviews) {

                        var interview = interviews[0];

                        return interview;
                    });
                });
            },

            /**
             * Loads all the entities of a certain type
             * @returns {Promise | Object} All architects
             */
            loadAll: function () {
                return Expression.loadAll('qldarch:Interview').then(function (interviews) {
                    console.log('loading all interviews');
                    return addArchitectsToInterviews(interviews);
                });
            },

            /**
             * Loads a list of entities
             * @param uris
             * @returns {Promise| Object} All architects with uris
             */
            loadList: function (uris) {
                return Expression.loadList(uris, 'qldarch:Interview').then(function (interviews) {
                    // Format architect
                    return addArchitectsToInterviews(interviews);
                });
            },

            findByIntervieweeUri: function (intervieweeUri) {
                return Expression.loadAll('qldarch:Interview').then(function (interviews) {

                    // Get the ones with this interviewee
                    var filteredInterviews = [];
                    angular.forEach(interviews, function (interview) {
                        if (interview[Uris.QA_INTERVIEWEE] == intervieweeUri) {
                            filteredInterviews.push(interview);
                        }
                    });
                    return addArchitectsToInterviews(filteredInterviews);
                });
            },
            /**
             * Finds all the interviews that mention a uri
             */
            findByMentionedUri: function (mentionedUri) {
                return Relationship.findByEntityUri(mentionedUri).then(function (relationships) {

                    // Get out all the evidence uris
                    var evidences = GraphHelper.getAttributeValuesUnique(relationships, Uris.QA_EVIDENCE);

                    // Get all the evidences so we can read their interview property
                    return Request.getIndexForUris('annotation/evidence', evidences).then(function (evidences) {
                        // Get all the interviews
                        var interviews = GraphHelper.getAttributeValuesUnique(evidences, Uris.QA_DOCUMENTED_BY);
                        return Expression.loadList(interviews, 'qldarch:Interview').then(function (interviews) {
                            var otherInterviews = [];
                            angular.forEach(interviews, function (interview) {
                                if (interview[Uris.QA_INTERVIEWEE] != mentionedUri) {
                                    otherInterviews.push(interview);
                                }
                            })
                            return addArchitectsToInterviews(otherInterviews);
                        });
                    });
                });
            }
        };
    });