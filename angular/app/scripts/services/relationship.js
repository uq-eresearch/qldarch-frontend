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
            getData: function (relationships) {
                var entities = GraphHelper.getAttributeValuesUnique(relationships, [Uris.QA_SUBJECT, Uris.QA_OBJECT]);
                var relatedRequests = [Entity.loadList(entities), Ontology.loadAllProperties()];

                return $q.all(relatedRequests).then(function (relatedData) {
                    var entities = relatedData[0];
                    var properties = relatedData[1];

                    // Insert that data
                    angular.forEach(relationships, function (relationship) {
                        relationship.subject = entities[relationship[Uris.QA_SUBJECT]];
                        relationship.object = entities[relationship[Uris.QA_OBJECT]];
                        relationship.predicate = properties[relationship[Uris.QA_PREDICATE]];
                    });

                    return {
                        relationships: relationships,
                        entities: entities
                    };
                });
            }
        };
    });