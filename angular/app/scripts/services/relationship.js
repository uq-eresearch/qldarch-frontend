'use strict';

angular.module('angularApp')
    .factory('Relationship', function ($http, $q, Uris, Request, Entity, Ontology, GraphHelper) {

        // Public API here
        return {
            findByInterviewUri: function (interviewUri) {
                return Request.http(Uris.JSON_ROOT + 'annotation', {
                    'RESOURCE': interviewUri,
                    'TIME': 0,
                    'DURATION': '99999'
                }).then(function (relationshipsAndEvidences) {
                    // Lets split them up cause ANDRAE IS INSANE!!!!!!!!!!!!!!!!!
                    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! bleh UGH!!!!!!!!!!!!!
                    var relationships = [];
                    angular.forEach(relationshipsAndEvidences, function (relationshipOrEvidence) {
                        if (angular.isDefined(relationshipOrEvidence[Uris.QA_EVIDENCE])) {
                            // its a relationship
                            var relationship = relationshipOrEvidence;
                            var evidenceUri = relationshipOrEvidence[Uris.QA_EVIDENCE];
                            if (!angular.isDefined(relationship.evidences)) {
                                relationship.evidences = [];
                            }
                            relationship.evidences.push(relationshipsAndEvidences[evidenceUri]);
                            relationships.push(relationship);
                        }
                    });

                    return relationships;
                });
            },
            findBySubjectPredicateObject: function (args) {
                return Request.http(Uris.JSON_ROOT + 'annotation/relationship', args, false);
            },
            findByEntityUri: function (uri) {
                var relationships = [];
                var promises = [
                    $http.get(Uris.JSON_ROOT + 'annotation/relationship?object=' + encodeURIComponent(uri)),
                    $http.get(Uris.JSON_ROOT + 'annotation/relationship?subject=' + encodeURIComponent(uri))
                ];

                return $q.all(promises).then(function (responses) {
                    angular.forEach(responses, function (response) {
                        angular.forEach(response.data, function (data) {
                            relationships.push(data);
                        });
                    });
                    return relationships;
                });
            },

            // http://qldarch.net/users/patriciadowling/Evidence#61562987181
            // http://qldarch.net/users/patriciadowling/Evidence#61725990004
            // 
            getData: function (relationships) {

                // loadList: function (uris, summary) {
                // Load the evidences
                var evidences = GraphHelper.getAttributeValuesUnique(relationships, Uris.QA_EVIDENCE);

                // Get all the evidences so we can read their interview property
                return Request.getIndexForUris('annotation/evidence', evidences).then(function (evidences) {
                    angular.forEach(evidences, function (evidence) {
                        evidence.encodedDocumentedBy = GraphHelper.encodeUriString(evidence[Uris.QA_DOCUMENTED_BY]);
                    });
                    var entitiesUris = GraphHelper.getAttributeValuesUnique(relationships, [Uris.QA_SUBJECT, Uris.QA_OBJECT]);
                    var relatedRequests = [Entity.loadList(entitiesUris), Ontology.loadAllProperties()];

                    return $q.all(relatedRequests).then(function (relatedData) {
                        var entities = relatedData[0];
                        var properties = relatedData[1];

                        // Insert that data
                        angular.forEach(relationships, function (relationship) {
                            relationship.subject = entities[relationship[Uris.QA_SUBJECT]];
                            relationship.object = entities[relationship[Uris.QA_OBJECT]];
                            relationship.predicate = properties[relationship[Uris.QA_PREDICATE]];
                            if (relationship.predicate.name) {
                                relationship.predicate.name = relationship.predicate.name.toLowerCase();
                            }
                            if (relationship.predicate[Uris.QA_LABEL]) {
                                relationship.predicate[Uris.QA_LABEL] = relationship.predicate[Uris.QA_LABEL].toLowerCase();
                            }

                            relationship.evidence = evidences[relationship[Uris.QA_EVIDENCE]];
                        });

                        return {
                            relationships: relationships,
                            entities: entities
                        };
                    });
                });
            }
        };
    });