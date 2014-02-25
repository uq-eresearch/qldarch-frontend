'use strict';

/*
 PREFIX :<http://qldarch.net/ns/rdf/2012-06/terms#>
 PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>

 select ?img where
 {
 <http://qldarch.net/rdf/2012-12/resources/people/11> :preferredImage ?i .
 ?i :hasFile ?fileRes .
 ?fileRes:systemLocation ?img .
 }
archi
 */

var myApp = angular.module('angularApp', [
    'config',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'typeahead',
    'ngProgress',
    'ui.bootstrap',
    'ui.select2',
    'ui.map',
    'audioPlayer',
    'ui.utils',
    'infinite-scroll',
    'ui.router'
])
    .run(function ($rootScope, $route, $location, ngProgress, Uris, Entity, $http, GraphHelper, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $rootScope.Uris = Uris;
        $rootScope.globalSearchString = '';
        // Adds the slim progress bar
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            // ngProgress.reset();
            ngProgress.color('#ea1d5d');
            ngProgress.start();
        });
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            ngProgress.stop();
            ngProgress.complete();
            $rootScope.globalSearchString = '';
        });
        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            console.log('State change error', event, toState, toParams, fromState, fromParams, error);
            console.log('State change error message:', error.message);
            ngProgress.reset();
        });

        /**
         * Finds entities with matching names
         * @param val
         * @returns {Promise|*}
         */
        $rootScope.globalSearch = function (val) {
            return Entity.findByName(val, false).then(function (entities) {
                var results = GraphHelper.graphValues(entities).slice(0, 5);
                var search = {
                    name: 'Search for \'' + val + '\'',
                    type: 'search',
                    query: val
                };
                results.push(search);
                return results;
            });
        };

        /**
         *
         * @param $item
         * @param $model
         * @param $label
         */
        $rootScope.globalSearchOnSelect = function ($item, $model, $label) {
            if ($item.type === 'search') {
                // special case
                console.log('should be searching for', $item.query);
                $location.path('/search');
                $location.search('query', $item.query);
            } else {
                // already a result
                $location.path("/" + $item.type + "/" + $item.encodedUri);
            }
        };


        //      $rootScope.getLocation = function(val) {
        //          return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
        //              params: {
        //                  address: val,
        //                  sensor: false
        //              }
        //          }).then(function(res){
        //              var addresses = [];
        ////                angular.forEach(res.data.results, function(item){
        ////                    addresses.push(item.formatted_address);
        ////                });
        //              console.log("addresses", addresses);
        //              return res.data.results;
        //          });
        //      };


    })
    .config(function ($stateProvider, $urlRouterProvider) {
        console.log('does this work?');
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise('/');

        // Now set up the states
        $stateProvider
            .state('main', {
                url: '/',
                controller: 'MainCtrl',
                resolve: {
                    // Load X number of interviews
                    interviews: ['Expression', 'GraphHelper', 'Uris', 'Architect', '$filter', 'Interview',
                        function (Expression, GraphHelper, Uris, Architect, $filter, Interview) {
                            console.log('resolving main');
                            return Interview.loadAll().then(function (interviews) {
                                interviews = GraphHelper.graphValues(interviews);
                                // Filter only the interviews with pictures
                                // Looks better for the front page
                                var interviewsWithPictures = $filter('filter')(interviews, function (interview) {
                                    return angular.isDefined(interview.interviewees) && interview.interviewees.length && angular.isDefined(interview.interviewees[0].picture);
                                });
                                return interviewsWithPictures;
                            });
                        }
                    ],
                    architects: ['Architect', 'GraphHelper', '$filter',
                        function (Architect, GraphHelper, $filter) {
                            return Architect.loadAll().then(function (architects) {
                                architects = GraphHelper.graphValues(architects);
                                return $filter('filter')(architects, function (architect) {
                                    return angular.isDefined(architect.picture);
                                });
                            });
                        }
                    ]
                },
                templateUrl: 'views/main.html'
            })
            .state('about', {
                url: '/about',
                templateUrl: 'views/about.html',
            })
            .state('contribute', {
                url: '/contribute',
                templateUrl: 'views/contribute.html',
            })
            .state('register', {
                url: '/register',
                templateUrl: 'views/register.html',
            })
            .state('login', {
                url: '/login',
                templateUrl: 'views/login.html',
            })
            .state('create', {
                abstract: true,
                url: '/create',
                template: '<ui-view></ui-view>'
            })
            .state('create.timeline', {
                url: '/timeline?timeline',
                templateUrl: 'views/create/timeline.html',
                controller: 'CreateTimelineCtrl',
                reloadOnSearch: false
            })
            .state('create.map', {
                url: '/map?map',
                templateUrl: 'views/create/map.html',
                controller: 'CreateMapCtrl',
                reloadOnSearch: false
            })
            .state('create.textAnalysis', {
                url: '/text-analysis'
            })
            .state('architects', {
                url: '/architects',
                templateUrl: 'views/architects.html',
                controller: 'ArchitectsCtrl',
                resolve: {
                    architects: ['Architect',
                        function (Architect) {
                            return Architect.loadAll();
                        }
                    ]
                }
            })
            .state('architect', {
                abstract: true,
                url: '/architect/:architectId',
                templateUrl: 'views/architect/layout.html',
                resolve: {
                    architect: ['Architect', '$stateParams', 'GraphHelper',
                        function (Architect, $stateParams, GraphHelper) {
                            var architectUri = GraphHelper.decodeUriString($stateParams.architectId);
                            return Architect.load(architectUri, false);
                        }
                    ],
                    interviews: ['Interview', '$stateParams', 'GraphHelper',
                        function (Interview, $stateParams, GraphHelper) {
                            var architectUri = GraphHelper.decodeUriString($stateParams.architectId);
                            return Interview.findByIntervieweeUri(architectUri);
                        }
                    ]
                },
                controller: ['$scope', 'architect', 'interviews',
                    function ($scope, architect, interviews) {
                        $scope.architect = architect;
                        $scope.interviews = interviews;
                    }
                ]
            })
            .state('architect.summary', {
                url: '',
                templateUrl: 'views/architect/summary.html',
                controller: 'ArchitectCtrl'
            })
            .state('architect.articles', {
                url: '/articles',
                templateUrl: 'views/architect/articles.html',
                controller: 'ArchitectArticlesCtrl',
                resolve: {
                    articles: ['$stateParams', 'GraphHelper', 'Entity', 'Solr', '$filter',
                        function ($stateParams, GraphHelper, Entity, Solr, $filter) {
                            var architectUri = GraphHelper.decodeUriString($stateParams.architectId);
                            return Entity.load(architectUri).then(function (entity) {
                                return Solr.query({
                                    query: entity.name,
                                    type: 'article'
                                }).then(function (results) {
                                    return $filter('filter')(results, {
                                        'type': 'article'
                                    });
                                });
                            });
                        }
                    ]
                }
            })
            .state('architect.relationships', {
                url: '/relationships',
                templateUrl: 'views/relationships.html',
                controller: 'RelationshipCtrl',
                resolve: {
                    data: ['Relationship', 'GraphHelper', 'Entity', '$stateParams',
                        function (Relationship, GraphHelper, Entity, $stateParams) {
                            var architectUri = GraphHelper.decodeUriString($stateParams.architectId);
                            // Get all the relationships
                            return Relationship.findByEntityUri(architectUri).then(function (relationships) {
                                return Relationship.getData(relationships);
                            });
                        }
                    ]
                }
            })
            .state('architect.timeline', {
                url: '/timeline',
                templateUrl: 'views/timeline.html',
                resolve: {
                    data: ['Relationship', 'GraphHelper', 'Entity', '$stateParams', '$filter', 'Uris',
                        function (Relationship, GraphHelper, Entity, $stateParams, $filter, Uris) {
                            var architectUri = GraphHelper.decodeUriString($stateParams.architectId);
                            // Get all the relationships
                            return Relationship.findByEntityUri(architectUri).then(function (relationships) {
                                var relationshipsWithDates = $filter('filter')(relationships, function (relationship) {
                                    return angular.isDefined(relationship[Uris.QA_START_DATE]);
                                });
                                return Relationship.getData(relationshipsWithDates);
                            });
                        }
                    ],
                    entity: ['Architect', '$stateParams', 'GraphHelper',
                        function (Architect, $stateParams, GraphHelper) {
                            var architectUri = GraphHelper.decodeUriString($stateParams.architectId);
                            return Architect.load(architectUri, false);
                        }
                    ]
                },
                controller: 'TimelineCtrl'
            })
            .state('architect.interview', {
                url: '/interview/:interviewId',
                templateUrl: 'views/architect/interview.html',
                controller: 'InterviewCtrl',
                resolve: {
                    interview: ['$http', '$stateParams', '$q', 'Uris', 'Architect', 'Interview', 'Transcript', 'Relationship', 'GraphHelper', 'Entity', 'Ontology',
                        function ($http, $stateParams, $q, Uris, Architect, Interview, Transcript, Relationship, GraphHelper, Entity, Ontology) {
                            var interviewUri = atob($stateParams.interviewId);

                            // Get all the interview
                            return Interview.load(interviewUri).then(function (interview) {

                                var transcriptUrls = GraphHelper.asArray(interview[Uris.QA_TRANSCRIPT_LOCATION]);
                                if (transcriptUrls.length === 0) {
                                    console.log('No transcript');
                                    return interview;
                                }
                                var transcriptUrl = transcriptUrls[0];
                                console.log('transcript urls', transcriptUrls);

                                return Transcript.findWithUrl(transcriptUrl).then(function (transcript) {
                                    return Relationship.findByInterviewUri(interviewUri).then(function (relationships) {
                                        // Get all the subject, object, and predicate data
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

                                            //                                      // Setup the transcript with all this new data
                                            interview.transcript = Transcript.setupTranscript(transcript, {
                                                interviewers: interview.interviewers,
                                                interviewees: interview.interviewees,
                                                relationships: relationships
                                            });
                                            return interview;
                                        });
                                    });
                                });
                            });
                        }
                    ]
                }
            })
            .state('architect.structures', {
                url: '/structures',
                templateUrl: 'views/architect/structures.html',
                resolve: {
                    structures: ['$stateParams', 'GraphHelper', 'Uris', 'Structure', 'Relationship',
                        function ($stateParams, GraphHelper, Uris, Structure, Relationship) {

                            var architectUri = GraphHelper.decodeUriString($stateParams.architectId);

                            return Relationship.findBySubjectPredicateObject({
                                predicate: 'qldarch:designedBy',
                                object: architectUri
                            }).then(function (designedByRelationships) {
                                var designedByStructureUris = GraphHelper.getAttributeValuesUnique(designedByRelationships, Uris.QA_SUBJECT);

                                return Relationship.findBySubjectPredicateObject({
                                    predicate: 'qldarch:workedOn',
                                    subject: architectUri
                                }).then(function (workedOnRelationships) {
                                    var workedOnStructureUris = GraphHelper.getAttributeValuesUnique(workedOnRelationships, Uris.QA_OBJECT);

                                    // Merge
                                    var structureUris = designedByStructureUris.concat(workedOnStructureUris);
                                    console.log(workedOnStructureUris);
                                    return Structure.loadList(structureUris, true).then(function (structures) {
                                        console.log('structures', structures);
                                        return structures;
                                    });
                                });
                            });
                        }
                    ]
                },
                controller: 'ArchitectStructuresCtrl'
            })
            .state('firms', {
                url: '/firms',
                templateUrl: 'views/firms.html',
                resolve: {
                    firms: ['Firm',
                        function (Firm) {
                            return Firm.loadAll();
                        }
                    ]
                },
                controller: 'FirmsCtrl'
            })
            .state('firm', {
                abstract: true,
                url: '/firm/:firmId',
                templateUrl: 'views/firm/layout.html',
                resolve: {
                    firm: ['$stateParams', 'Firm', 'GraphHelper',
                        function ($stateParams, Firm, GraphHelper) {
                            var firmUri = GraphHelper.decodeUriString($stateParams.firmId);
                            return Firm.load(firmUri);
                        }
                    ]
                },
                controller: ['$scope', 'firm',
                    function ($scope, firm) {
                        $scope.firm = firm;
                    }
                ]
            })
            .state('firm.summary', {
                url: '',
                templateUrl: 'views/firm/summary.html',
                controller: ['$scope', 'firm',
                    function ($scope, firm) {
                        $scope.firm = firm;
                    }
                ]
            })
            .state('firm.employees', {
                url: '/employees',
                templateUrl: 'views/firm/employees.html',
                resolve: {
                    employees: ['$stateParams', 'GraphHelper', 'Uris', 'Architect', 'Relationship',
                        function ($stateParams, GraphHelper, Uris, Architect, Relationship) {
                            var firmUri = GraphHelper.decodeUriString($stateParams.firmId);

                            return Relationship.findBySubjectPredicateObject({
                                predicate: 'qldarch:employedBy',
                                object: firmUri
                            }).then(function (relationships) {
                                // Get all the architects
                                var architectUris = GraphHelper.getAttributeValuesUnique(relationships, Uris.QA_SUBJECT);
                                return Architect.loadList(architectUris, true).then(function (architects) {
                                    return GraphHelper.graphValues(architects);
                                });
                            });
                        }
                    ]
                },
                controller: ['$scope', 'firm', 'employees', 'LayoutHelper',
                    function ($scope, firm, employees, LayoutHelper) {
                        $scope.firm = firm;
                        $scope.employeeRows = LayoutHelper.group(employees, 6);
                    }
                ]
            })
            .state('firm.structures', {
                url: '/structures',
                templateUrl: 'views/firm/structures.html',
                resolve: {
                    structures: ['$stateParams', 'GraphHelper', 'Uris', 'Structure', 'Relationship',
                        function ($stateParams, GraphHelper, Uris, Structure, Relationship) {
                            var firmUri = GraphHelper.decodeUriString($stateParams.firmId);

                            return Relationship.findBySubjectPredicateObject({
                                predicate: 'qldarch:designedBy',
                                object: firmUri
                            }).then(function (relationships) {
                                // Get all the architects
                                var structureUris = GraphHelper.getAttributeValuesUnique(relationships, Uris.QA_SUBJECT);
                                return Structure.loadList(structureUris, true).then(function (structures) {
                                    return GraphHelper.graphValues(structures);
                                });
                            });
                        }
                    ]
                },
                controller: ['$scope', 'firm', 'structures', 'LayoutHelper',
                    function ($scope, firm, structures, LayoutHelper) {
                        $scope.firm = firm;
                        $scope.structureRows = LayoutHelper.group(structures, 6);
                    }
                ]
            })
            .state('firm.lineDrawings', {
                url: '/line-drawings',
                templateUrl: 'views/firm/linedrawings.html',
                resolve: {
                    lineDrawings: ['GraphHelper', '$stateParams', 'Expression',
                        function (GraphHelper, $stateParams, Expression) {
                            var firmUri = GraphHelper.decodeUriString($stateParams.firmId);
                            return Expression.findByFirmUris([firmUri], 'qldarch:LineDrawing');
                        }
                    ]
                },
                controller: ['$scope', 'lineDrawings', 'LayoutHelper',
                    function ($scope, lineDrawings, LayoutHelper) {
                        $scope.lineDrawingRows = LayoutHelper.group(lineDrawings, 6);
                    }
                ]
            })
            .state('firm.lineDrawing', {
                url: '/line-drawing/:lineDrawingId',
                templateUrl: 'views/linedrawing.html',
                resolve: {
                    lineDrawing: ['Expression', '$stateParams', 'GraphHelper', 'Uris', 'Firm',
                        function (Expression, $stateParams, GraphHelper, Uris, Firm) {
                            var lineDrawingUri = GraphHelper.decodeUriString($stateParams.lineDrawingId);
                            console.log('loading firm');
                            return Expression.load(lineDrawingUri, 'qldarch:LineDrawing').then(function (lineDrawing) {
                                // Loading building if its there
                                if (angular.isDefined(lineDrawing[Uris.QA_DEPICTS_BUILDING])) {
                                    return Firm.load(lineDrawing[Uris.QA_DEPICTS_BUILDING]).then(function (structure) {
                                        lineDrawing.building = structure;
                                        return lineDrawing;
                                    });
                                } else {
                                    return lineDrawing;
                                }
                            });
                        }
                    ]
                },
                controller: ['$scope', 'lineDrawing',
                    function ($scope, lineDrawing) {
                        $scope.lineDrawing = lineDrawing;
                    }
                ]
            })
            .state('firm.relationships', {
                url: '/relationships',
                templateUrl: 'views/relationships.html',
                resolve: {
                    data: ['Relationship', 'GraphHelper', 'Entity', '$stateParams',
                        function (Relationship, GraphHelper, Entity, $stateParams) {
                            var firmUri = GraphHelper.decodeUriString($stateParams.firmId);
                            // Get all the relationships
                            return Relationship.findByEntityUri(firmUri).then(function (relationships) {
                                return Relationship.getData(relationships);
                            });
                        }
                    ]
                },
                controller: 'RelationshipCtrl'
            })
            .state('firm.timeline', {
                url: '/timeline',
                templateUrl: 'views/timeline.html',
                resolve: {
                    data: ['Relationship', 'GraphHelper', 'Entity', '$stateParams', '$filter', 'Uris',
                        function (Relationship, GraphHelper, Entity, $stateParams, $filter, Uris) {

                            var firmUri = GraphHelper.decodeUriString($stateParams.firmId);
                            // Get all the relationships
                            return Relationship.findByEntityUri(firmUri).then(function (relationships) {
                                var relationshipsWithDates = $filter('filter')(relationships, function (relationship) {
                                    return angular.isDefined(relationship[Uris.QA_START_DATE]);
                                });
                                return Relationship.getData(relationshipsWithDates);
                            });
                        }
                    ],
                    entity: ['Firm', '$stateParams', 'GraphHelper',
                        function (Firm, $stateParams, GraphHelper) {
                            var firmUri = GraphHelper.decodeUriString($stateParams.firmId);
                            return Firm.load(firmUri, false);
                        }
                    ]
                },
                controller: 'TimelineCtrl'
            })
            .state('structures', {
                url: '/structures',
                templateUrl: 'views/structures.html',
                controller: 'StructuresCtrl',
                resolve: {
                    structures: ['Structure',
                        function (Structure) {
                            return Structure.loadAll();
                        }
                    ]
                }
            })
            .state('structure', {
                abstract: true,
                url: '/structure/:structureId',
                templateUrl: 'views/structure/layout.html',
                resolve: {
                    structure: ['$http', '$stateParams', 'Uris', 'Structure', 'GraphHelper',
                        function ($http, $stateParams, Uris, Structure, GraphHelper) {
                            var structureUri = GraphHelper.decodeUriString($stateParams.structureId);
                            return Structure.load(structureUri);
                        }
                    ]
                },
                controller: ['$scope', 'structure',
                    function ($scope, structure) {
                        $scope.structure = structure;
                    }
                ]
            })
            .state('structure.summary', {
                url: '',
                templateUrl: 'views/structure/summary.html',
                resolve: {
                    designers: ['$stateParams', 'GraphHelper', 'Uris', 'Entity', 'Relationship',
                        function ($stateParams, GraphHelper, Uris, Entity, Relationship) {
                            var structureUri = GraphHelper.decodeUriString($stateParams.structureId);

                            return Relationship.findBySubjectPredicateObject({
                                predicate: 'qldarch:designedBy',
                                subject: structureUri
                            }).then(function (relationships) {
                                // Get all the architects
                                var designerUris = GraphHelper.getAttributeValuesUnique(relationships, Uris.QA_OBJECT);
                                return Entity.loadList(designerUris, false).then(function (entities) {
                                    return GraphHelper.graphValues(entities);
                                });
                            });
                        }
                    ]
                },
                controller: ['$scope', 'structure', 'designers',
                    function ($scope, structure, designers) {
                        $scope.structure = structure;
                        $scope.designers = designers;
                    }
                ]
            })
            .state('structure.map', {
                url: '/map',
                templateUrl: 'views/structure/map.html',
                controller: 'StructureMapCtrl'
            })
            .state('structure.photographs', {
                url: '/photographs',
                templateUrl: 'views/structure/photographs.html',
                resolve: {
                    photographs: ['GraphHelper', 'Structure', 'Expression', '$stateParams',
                        function (GraphHelper, Structure, Expression, $stateParams) {
                            var structureUri = GraphHelper.decodeUriString($stateParams.structureId);
                            return Expression.findByBuildingUris([structureUri], 'qldarch:Photograph');
                        }
                    ]
                },
                controller: ['$scope', 'photographs', 'LayoutHelper',
                    function ($scope, photographs, LayoutHelper) {
                        $scope.photographRows = LayoutHelper.group(photographs, 6);
                    }
                ]
            })
            .state('structure.photograph', {
                url: '/photograph/:photographId',
                templateUrl: 'views/photograph.html',
                resolve: {
                    photograph: ['Expression', '$stateParams', 'GraphHelper', 'Uris', 'Structure',
                        function (Expression, $stateParams, GraphHelper, Uris, Structure) {
                            var photographUri = GraphHelper.decodeUriString($stateParams.photographId);
                            return Expression.load(photographUri, 'qldarch:Photograph').then(function (photograph) {
                                // Loading building if its there
                                if (angular.isDefined(photograph[Uris.QA_DEPICTS_BUILDING])) {
                                    return Structure.load(photograph[Uris.QA_DEPICTS_BUILDING]).then(function (structure) {
                                        photograph.building = structure;
                                        return photograph;
                                    });
                                } else {
                                    return photograph;
                                }
                            });
                        }
                    ]
                },
                controller: 'PhotographCtrl'
            })
            .state('structure.lineDrawings', {
                url: '/line-drawings',
                templateUrl: 'views/structure/linedrawings.html',
                resolve: {
                    lineDrawings: ['GraphHelper', '$stateParams', 'Expression',
                        function (GraphHelper, $stateParams, Expression) {
                            var structureUri = GraphHelper.decodeUriString($stateParams.structureId);
                            return Expression.findByBuildingUris([structureUri], 'qldarch:LineDrawing');
                        }
                    ]
                },
                controller: ['$scope', 'lineDrawings', 'LayoutHelper',
                    function ($scope, lineDrawings, LayoutHelper) {
                        $scope.lineDrawingRows = LayoutHelper.group(lineDrawings, 6);
                    }
                ]
            })
            .state('structure.lineDrawing', {
                url: '/line-drawing/:lineDrawingId',
                templateUrl: 'views/linedrawing.html',
                resolve: {
                    lineDrawing: ['Expression', '$stateParams', 'GraphHelper', 'Uris', 'Structure',
                        function (Expression, $stateParams, GraphHelper, Uris, Structure) {
                            var lineDrawingUri = GraphHelper.decodeUriString($stateParams.lineDrawingId);
                            return Expression.load(lineDrawingUri, 'qldarch:LineDrawing').then(function (lineDrawing) {
                                // Loading building if its there
                                if (angular.isDefined(lineDrawing[Uris.QA_DEPICTS_BUILDING])) {
                                    return Structure.load(lineDrawing[Uris.QA_DEPICTS_BUILDING]).then(function (structure) {
                                        lineDrawing.building = structure;
                                        return lineDrawing;
                                    });
                                } else {
                                    return lineDrawing;
                                }
                            });
                        }
                    ]
                },
                controller: ['$scope', 'lineDrawing',
                    function ($scope, lineDrawing) {
                        $scope.lineDrawing = lineDrawing;
                    }
                ]
            })
            .state('structure.timeline', {
                url: '/timeline',
                templateUrl: 'views/timeline.html',
                resolve: {
                    data: ['Relationship', 'GraphHelper', 'Entity', '$stateParams', '$filter', 'Uris',
                        function (Relationship, GraphHelper, Entity, $stateParams, $filter, Uris) {

                            var structureUri = GraphHelper.decodeUriString($stateParams.structureId);
                            // Get all the relationships
                            return Relationship.findByEntityUri(structureUri).then(function (relationships) {
                                var relationshipsWithDates = $filter('filter')(relationships, function (relationship) {
                                    return angular.isDefined(relationship[Uris.QA_START_DATE]);
                                });
                                return Relationship.getData(relationshipsWithDates);
                            });
                        }
                    ],
                    entity: ['Structure', '$stateParams', 'GraphHelper',
                        function (Structure, $stateParams, GraphHelper) {
                            var structureUri = GraphHelper.decodeUriString($stateParams.structureId);
                            return Structure.load(structureUri, false);
                        }
                    ]
                },
                controller: 'TimelineCtrl'
            })
            .state('structure.relationships', {
                url: '/relationships',
                templateUrl: 'views/relationships.html',
                resolve: {
                    data: ['Relationship', 'GraphHelper', 'Entity', '$stateParams',
                        function (Relationship, GraphHelper, Entity, $stateParams) {
                            var structureUri = GraphHelper.decodeUriString($stateParams.structureId);
                            // Get all the relationships
                            return Relationship.findByEntityUri(structureUri).then(function (relationships) {
                                return Relationship.getData(relationships);
                            });
                        }
                    ]
                },
                controller: 'RelationshipCtrl'
            });
    });
// .config(function ($routeProvider) {
/*$routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                resolve: {
                    // Load X number of interviews
                    interviews: function (Expression, GraphHelper, Uris, Architect, $filter, Interview) {

                        return Interview.loadAll().then(function (interviews) {
                            interviews = GraphHelper.graphValues(interviews);
                            var interviewsWithPictures = $filter('filter')(interviews, function (interview) {
                                return angular.isDefined(interview.interviewees) && interview.interviewees.length && angular.isDefined(interview.interviewees[0].picture);
                            });
                            return interviewsWithPictures;
                        });
                    },
                    architects: function (Architect, GraphHelper, $filter) {
                        return Architect.loadAll().then(function (architects) {
                            architects = GraphHelper.graphValues(architects);
                            return $filter('filter')(architects, function (architect) {
                                return angular.isDefined(architect.picture);
                            });
                        });
                    }
                }
            })
            .when('/myroute', {
                templateUrl: 'views/myroute.html',
                controller: 'MyrouteCtrl'
            })
            .when('/someroute', {
                templateUrl: 'views/someroute.html',
                controller: 'SomerouteCtrl'
            })

        .when('/architect/:architectId', {
            templateUrl: 'views/architects/summary.html',
            controller: 'ArchitectCtrl',
            resolve: {
                architect: function (Architect, $route, GraphHelper) {
                    var architectUri = GraphHelper.decodeUriString($route.current.params.architectId);
                    return Architect.load(architectUri, false);
                },
                interviews: function (Interview, $route, GraphHelper) {
                    var architectUri = GraphHelper.decodeUriString($route.current.params.architectId);
                    return Interview.findByIntervieweeUri(architectUri);
                },
                // mentions: function (Interview, GraphHelper, $route) {
                //  var architectUri = GraphHelper.decodeUriString($route.current.params.architectId);
                //  return Interview.findByMentionedUri(architectUri);
                // },

                // firms: function (GraphHelper, Relationship, Uris, Entity, $route) {
                //  var architectUri = GraphHelper.decodeUriString($route.current.params.architectId);

                //  return Relationship.findBySubjectPredicateObject({
                //      predicate: "qldarch:employedBy",
                //      subject: architectUri
                //  }).then(function (relationships) {
                //      // Get all the firms
                //      var firmUris = GraphHelper.getAttributeValuesUnique(relationships, Uris.QA_OBJECT);
                //      return Entity.loadList(firmUris, true).then(function (firms) {
                //          return firms;
                //      })
                //  });
                // },
                // structures: function ($route, GraphHelper, Uris, Structure, Relationship) {
                //  var architectUri = GraphHelper.decodeUriString($route.current.params.architectId);

                //  return Relationship.findBySubjectPredicateObject({
                //      predicate: "qldarch:designedBy",
                //      object: architectUri
                //  }).then(function (relationships) {
                //      // Get all the architects
                //      var structureUris = GraphHelper.getAttributeValuesUnique(relationships, Uris.QA_SUBJECT);
                //      return Structure.loadList(structureUris, true);
                //  });
                // }
                //                  relationships: function($route, Relationship, Entity, GraphHelper, Uris) {
                //                      var architectUri = GraphHelper.decodeUriString($route.current.params.architectId);
                //
                //                      return Relationship.findByEntityUri(architectUri).then(function (relationships) {
                //                          // Get all the unique entities
                //                          var entityUris = GraphHelper.getAttributeValuesUnique(relationships, [Uris.QA_SUBJECT, Uris.QA_OBJECT]);
                //
                //                          // Now load those entities
                //                          return Entity.loadList(entityUris, true).then(function (entities) {
                //                              return Ontology.loadAllProperties().then(function(properties) {
                //                                  angular.forEach(relationships, function(relationship) {
                //                                      // set the subject and object
                //                                      relationship.subject = entities[relationship[Uris.QA_SUBJECT]];
                //                                      relationship.object = entities[relationship[Uris.QA_OBJECT]];
                //                                  })
                //
                //                                  return relationships;
                //                              });
                //                          });
                //                      });
                //                  }
            }
        })
            .when('/architect/:architectId/structures', {
                templateUrl: 'views/architects/structures.html',
                controller: 'ArchitectStructuresCtrl',
                resolve: {
                    architect: function (Architect, $route, GraphHelper) {
                        return Architect.load(GraphHelper.decodeUriString($route.current.params.architectId), false);
                    },
                    interviews: function (Interview, $route, GraphHelper) {
                        return Interview.findByIntervieweeUri(GraphHelper.decodeUriString($route.current.params.architectId));
                    },
                    structures: function ($route, GraphHelper, Uris, Structure, Relationship) {
                        var architectUri = GraphHelper.decodeUriString($route.current.params.architectId);

                        return Relationship.findBySubjectPredicateObject({
                            predicate: 'qldarch:designedBy',
                            object: architectUri
                        }).then(function (designedByRelationships) {
                            var designedByStructureUris = GraphHelper.getAttributeValuesUnique(designedByRelationships, Uris.QA_SUBJECT);

                            return Relationship.findBySubjectPredicateObject({
                                predicate: 'qldarch:workedOn',
                                subject: architectUri
                            }).then(function (workedOnRelationships) {
                                var workedOnStructureUris = GraphHelper.getAttributeValuesUnique(workedOnRelationships, Uris.QA_OBJECT);

                                // Merge
                                var structureUris = designedByStructureUris.concat(workedOnStructureUris);
                                console.log('structure uris');
                                console.log(workedOnStructureUris);
                                return Structure.loadList(structureUris, true).then(function (structures) {
                                    console.log('structures', structures);
                                    return structures;
                                });
                            });
                        });
                    }
                }
            })
            .when('/architect/:architectUriEncoded/articles', {
                templateUrl: 'views/architects/articles.html',
                controller: 'ArchitectArticlesCtrl',
                resolve: {
                    architect: function (Architect, $route, GraphHelper) {
                        return Architect.load(GraphHelper.decodeUriString($route.current.params.architectUriEncoded), false);
                    },
                    interviews: function (Interview, $route, GraphHelper) {
                        return Interview.findByIntervieweeUri(GraphHelper.decodeUriString($route.current.params.architectUriEncoded));
                    },
                    articles: function ($route, GraphHelper, Entity, Solr, $filter) {
                        var architectUri = GraphHelper.decodeUriString($route.current.params.architectUriEncoded);

                        return Entity.load(architectUri).then(function (entity) {
                            return Solr.query({
                                query: entity.name,
                                type: 'article'
                            }).then(function (results) {
                                return $filter('filter')(results, {
                                    'type': 'article'
                                });
                            });
                        });
                    }
                }
            })
            .when('/architect/:architectUriEncoded/relationships', {
                templateUrl: 'views/architects/relationships.html',
                controller: 'ArchitectRelationshipsCtrl',
                resolve: {
                    architect: function (Architect, $route, GraphHelper) {
                        var architectUri = GraphHelper.decodeUriString($route.current.params.architectUriEncoded);
                        return Architect.load(architectUri, false);
                    },
                    interviews: function (Interview, $route, GraphHelper) {
                        var architectUri = GraphHelper.decodeUriString($route.current.params.architectUriEncoded);
                        return Interview.findByIntervieweeUri(architectUri);
                    },
                    data: function (Relationship, GraphHelper, Entity, $route, Ontology, Uris, $q) {
                        var architectUri = GraphHelper.decodeUriString($route.current.params.architectUriEncoded);
                        // Get all the relationships
                        return Relationship.findByEntityUri(architectUri).then(function (relationships) {
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
                        });
                    }
                }
            })
            .when('/architect/:architectUriEncoded/interview/:interviewUriEncoded', {
                templateUrl: 'views/interview.html',
                controller: 'InterviewCtrl',
                resolve: {
                    architect: function (Architect, $route, GraphHelper) {
                        var architectUri = GraphHelper.decodeUriString($route.current.params.architectUriEncoded);
                        return Architect.load(architectUri, false);
                    },
                    interviews: function (Interview, $route, GraphHelper) {
                        var architectUri = GraphHelper.decodeUriString($route.current.params.architectUriEncoded);
                        return Interview.findByIntervieweeUri(architectUri);
                    },
                    interview: function ($http, $route, $q, Uris, Architect, Interview, Transcript, Relationship, GraphHelper, Entity, Ontology) {
                        var interviewUri = atob($route.current.params.interviewUriEncoded);

                        // Get all the interview
                        return Interview.load(interviewUri).then(function (interview) {

                            var transcriptUrl = interview[Uris.QA_TRANSCRIPT_LOCATION];

                            return Transcript.findWithUrl(transcriptUrl).then(function (transcript) {
                                return Relationship.findByInterviewUri(interviewUri).then(function (relationships) {
                                    // Get all the subject, object, and predicate data
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

                                        //                                      // Setup the transcript with all this new data
                                        interview.transcript = Transcript.setupTranscript(transcript, {
                                            interviewers: interview.interviewers,
                                            interviewees: interview.interviewees,
                                            relationships: relationships
                                        });
                                        return interview;
                                    });
                                });
                            });
                        });
                    }
                }
            })
            .when('/architects', {
                templateUrl: 'views/architects.html',
                controller: 'ArchitectsCtrl',
                resolve: {
                    architects: function ($http, Architect) {
                        return Architect.loadAll();
                    }
                }
            })
            
            .when('/interviews', {
                templateUrl: 'views/interviews.html',
                controller: 'InterviewsCtrl',
                resolve: {
                    interviews: function (Expression, GraphHelper, Uris, Architect, Interview) {
                        return Interview.loadAll();
                    }
                }
            })
            .when('/firm/:firmUriEncoded', {
                templateUrl: 'views/firms/firm.html',
                controller: 'FirmCtrl',
                resolve: {
                    firm: function ($route, Firm, GraphHelper) {
                        var firmUri = GraphHelper.decodeUriString($route.current.params.firmUriEncoded);
                        return Firm.load(firmUri);
                    },
                    architects: function ($route, GraphHelper, Uris, Architect, Relationship) {
                        var firmUri = GraphHelper.decodeUriString($route.current.params.firmUriEncoded);

                        return Relationship.findBySubjectPredicateObject({
                            predicate: 'qldarch:employedBy',
                            object: firmUri
                        }).then(function (relationships) {
                            // Get all the architects
                            var architectUris = GraphHelper.getAttributeValuesUnique(relationships, Uris.QA_SUBJECT);
                            return Architect.loadList(architectUris, true);
                        });
                    },
                    structures: function ($route, GraphHelper, Uris, Structure, Relationship) {
                        var firmUri = GraphHelper.decodeUriString($route.current.params.firmUriEncoded);

                        return Relationship.findBySubjectPredicateObject({
                            predicate: 'qldarch:designedBy',
                            object: firmUri
                        }).then(function (relationships) {
                            // Get all the architects
                            var structureUris = GraphHelper.getAttributeValuesUnique(relationships, Uris.QA_SUBJECT);
                            return Structure.loadList(structureUris, true);
                        });
                    }
                }
            })
            .when('/firms', {
                templateUrl: 'views/firms/firms.html',
                controller: 'FirmsCtrl',
                resolve: {
                    firms: function (Firm) {
                        return Firm.loadAll();
                    }
                }
            })
            .when('/structures', {
                templateUrl: 'views/structures.html',
                controller: 'StructuresCtrl',
                resolve: {
                    structures: function (Structure) {
                        return Structure.loadAll();
                    }
                }
            })
            .when('/structure/:structureUriEncoded', {
                templateUrl: 'views/structure.html',
                controller: 'StructureCtrl',
                resolve: {
                    structure: function ($http, $route, Uris, Structure, GraphHelper) {
                        var structureUri = GraphHelper.decodeUriString($route.current.params.structureUriEncoded);
                        console.log("strcture uri", structureUri);
                        return Structure.load(structureUri);
                    },
                    photographs: function (GraphHelper, Structure, Expression, $route) {
                        var structureUri = GraphHelper.decodeUriString($route.current.params.structureUriEncoded);
                        return Expression.findByBuildingUris([structureUri]);
                    },
                    designers: function ($route, GraphHelper, Uris, Entity, Relationship) {
                        var structureUri = GraphHelper.decodeUriString($route.current.params.structureUriEncoded);

                        return Relationship.findBySubjectPredicateObject({
                            predicate: "qldarch:designedBy",
                            subject: structureUri
                        }).then(function (relationships) {
                            // Get all the architects
                            var designerUris = GraphHelper.getAttributeValuesUnique(relationships, Uris.QA_OBJECT);
                            return Entity.loadList(designerUris, false);
                        });
                    }
                }
            })
            .when('/search', {
                templateUrl: 'views/search.html',
                controller: 'SearchCtrl',
                resolve: {
                    results: function ($location, $http, Expression, Uris, $q) {
                        var query = $location.search().query;
                        var url = "scripts/searchresults.json";

                        if (!query) {
                            return $q.reject("No query");
                        }
                        return $http.get(url).then(function (response) {

                            // We need to go through all the results
                            // And put in a title, and a url that it links to
                            // Go through and get out all the titles

                            var results = [];
                            var interviewUris = [];

                            var expressionUris = [];
                            angular.forEach(response.data.response.docs, function (doc, index) {
                                var found = false;
                                angular.forEach(results, function (result, resultIndex) {

                                });

                                var result;

                                // Interview
                                if (angular.isDefined(doc.interview)) {
                                    // check that we dont have it already
                                    var found = false;
                                    angular.forEach(results, function (storedResult) {
                                        if (storedResult.uri == doc.interview) {
                                            result = storedResult;
                                            result.text += " " + doc.transcript;
                                            found = true;
                                        }
                                    })
                                    if (!found) {
                                        result = {};
                                        result.text = doc.transcript;
                                        results.push(result);
                                        interviewUris.push(doc.interview);
                                    }

                                    // Store the encodedUri
                                    result.uri = doc.interview;
                                    result.encodedUri = btoa(doc.interview);
                                    result.type = "interview";

                                }

                                // Article
                                if (angular.isDefined(doc.article)) {
                                    result = {};
                                    // Store the encodedUri
                                    result.title = doc.title[0];
                                    result.uri = doc.id;
                                    result.encodedUri = btoa(doc.id);
                                    result.type = "article";
                                    result.text = doc.article;
                                    results.push(result);
                                }


                                var indexes = [];
                                var terms = query.split(" ");
                                var indexFrom = 0;

                                angular.forEach(terms, function (term, termIndex) {

                                    var indexOf = result.text.toLowerCase().indexOf(term.toLowerCase(), indexFrom);
                                    while (indexOf != -1) {
                                        indexes.push(indexOf);
                                        indexFrom = indexOf + term.length;
                                        indexOf = result.text.toLowerCase().indexOf(term.toLowerCase(), indexFrom);
                                    }
                                });


                                var ranges = [];
                                var BACK_LENGTH = 10;
                                var FORWARD_LENGTH = 50;
                                angular.forEach(indexes, function (index, bloop) {
                                    var found = false;
                                    angular.forEach(ranges, function (range, rangeIndex) {
                                        if (range.start <= index && index <= range.end) {
                                            found = true;
                                            range.start = Math.min(index - BACK_LENGTH, range.start);
                                            range.end = Math.max(index + FORWARD_LENGTH, range.end);
                                            // Probably need to recompute the ranges here
                                        }
                                    });
                                    if (!found) {
                                        // stuff
                                        var newRange = {
                                            start: index - BACK_LENGTH,
                                            end: index + FORWARD_LENGTH
                                        };
                                        ranges.push(newRange);
                                    }
                                });

                                // Create the snippet
                                result.snippet = "";
                                angular.forEach(ranges, function (range, rangeIndex) {
                                    result.snippet += "..." + result.text.substring(Math.max(0, range.start), Math.min(range.end, result.text.length)) + "...";
                                });

                                // Highlight the terms
                                angular.forEach(terms, function (term) {
                                    var patt = new RegExp(term, "gi");
                                    result.snippet = result.snippet.replace(patt, function (match) {
                                        return "<strong>" + match + "</strong>"
                                    });
                                });

                                // Calculate the ranking based on terms
                                result.rank = indexes.length;
                                // Adjust rankings based on whole query occuring
                                var patt = new RegExp(query, "gi");
                                var fullMatches = result.text.match(patt);
                                if (fullMatches) {
                                    result.rank += 5 * fullMatches.length;
                                }
                            });

                            return Expression.loadList(interviewUris, "qldarch:Interview").then(function (expressions) {
                                angular.forEach(results, function (result, index) {
                                    if (result.type == "interview") {
                                        result.title = expressions[result.uri][Uris.DCT_TITLE];
                                    }
                                });

                                return results;
                            })
                        });
                    }
                }
            })
            .when('/browse', {
                templateUrl: 'views/browse.html',
                controller: 'BrowseCtrl'
            })
            .when('/explore', {
                templateUrl: 'views/explore.html',
                controller: 'ExploreCtrl',
                resolve: {

                }
            })
            .when('/photograph/:photographUriEncoded', {
                templateUrl: 'views/photograph.html',
                controller: 'PhotographCtrl',
                resolve: {
                    photograph: function (Expression, $route, GraphHelper, Uris, Structure) {
                        var photographUri = GraphHelper.decodeUriString($route.current.params.photographUriEncoded);
                        return Expression.load(photographUri, "qldarch:Photograph").then(function (photograph) {
                            if (angular.isDefined(photograph[Uris.QA_DEPICTS_BUILDING])) {
                                return Structure.load(photograph[Uris.QA_DEPICTS_BUILDING]).then(function (structure) {
                                    photograph.building = structure;
                                    return photograph;
                                })
                            } else {
                                return photograph;
                            }
                        });
                    }
                }
            })
            
            .when('/building-typology/:buildingTypologyUriEncoded', {
                templateUrl: 'views/buildingTypology.html',
                controller: 'BuildingtypologyCtrl',
                resolve: {
                    buildingTypology: function (Entity, $route, GraphHelper) {
                        var buildingTypologyUri = GraphHelper.decodeUriString($route.current.params.buildingTypologyUriEncoded);
                        return Entity.load(buildingTypologyUri);
                    },
                    structures: function (Structure, GraphHelper, $route) {
                        var buildingTypologyUri = GraphHelper.decodeUriString($route.current.params.buildingTypologyUriEncoded);
                        return Structure.findByBuildingTypologyUri(buildingTypologyUri);
                    }
                }
            })
            .when('/building-typologies', {
                templateUrl: 'views/buildingTypologies.html',
                controller: 'BuildingtypologiesCtrl',
                resolve: {
                    buildingTypologies: function (Entity) {
                        return Entity.loadAll("qldarch:BuildingTypology", true);
                    }
                }
            })
            .when('/articles', {
                templateUrl: 'views/articles.html',
                controller: 'ArticlesCtrl',
                resolve: {
                    articles: function (Expression) {
                        return Expression.loadAll("qldarch:Article");
                    }
                }
            })
            .when('/article/:articleUriEncoded', {
                templateUrl: 'views/article.html',
                controller: 'ArticleCtrl',
                resolve: {
                    article: function (Expression, $route, GraphHelper) {
                        var articleUri = GraphHelper.decodeUriString($route.current.params.articleUriEncoded);
                        return Expression.load(articleUri, "qldarch:Article");
                    }
                }
            })
            .when('/signin', {
                templateUrl: 'views/signin.html',
                controller: 'SigninCtrl'
            })
            
            .otherwise({
                redirectTo: '/'
            });*/
// });