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

angular.module('angularApp', [
    'config',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngAnimate',
    'ngRoute',
    'ngProgress',
    'ui.bootstrap',
    'ui.select2',
    'ui.map',
    'audioPlayer',
    'ui.utils',
    'infinite-scroll',
    'ui.router',
    'angularFileUpload',
    'toaster'
])
    .run(function($rootScope, $route, $location, ngProgress, Uris, Entity, $http, GraphHelper, $state, $stateParams, Auth, $filter) {

        // Fix bug with scrolling to top with ui-router changing
        $rootScope.$on('$viewContentLoaded', function() {
            var interval = setInterval(function() {
                if (document.readyState === 'complete') {
                    window.scrollTo(0, 0);
                    clearInterval(interval);
                }
            }, 200);
        });

        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.Auth = Auth;
        $rootScope.Uris = Uris;

        $http.get(Uris.JSON_ROOT + 'login/status').then(function(status) {
            angular.extend(Auth, status.data);
        });

        $rootScope.globalSearch = {};
        $rootScope.globalSearch.query = '';
        var tempFromState = {};
        // Adds the slim progress bar
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

            console.log('changing', event, toState, toParams, fromState, fromParams);

            // Catch if we are going to login
            if (toState.name === 'login' && fromState.name !== '') {
                tempFromState.fromState = fromState;
                tempFromState.fromParams = fromParams;
            }
            if (fromState.name === 'login' && toState.name !== 'forgot' &&
            		tempFromState.fromState.name !== 'forgot') {
                // Do we have a previous state stored?
                if (tempFromState.fromState) {
                    event.preventDefault();
                    var nextState = tempFromState;
                    tempFromState = {};
                    $state.go(nextState.fromState.name, nextState.fromParams);
                }
            }
            // event.preventDefault();
            ngProgress.reset();
            ngProgress.color('#ea1d5d');
            ngProgress.start();
        });
        $rootScope.$on('$stateChangeSuccess', function() {
            ngProgress.complete();
            $rootScope.globalSearch.query = '';
        });
        $rootScope.$on('$stateChangeError', function() {
            ngProgress.reset();
            ngProgress.reset();
        });

        /**
         * Finds entities with matching names
         * @param val
         * @returns {Promise|*}
         */
        $rootScope.globalSearch = function(val) {
            return Entity.findByName(val, false).then(function(entities) {
                var results = GraphHelper.graphValues(entities);
                results = $filter('filter')(results, function(result) {
                    return result.type === 'architect' || result.type === 'structure' || result.type === 'firm' || result.type === 'other';
                });
                results = $filter('orderBy')(results, function(result) {
                    return result.name.length;
                });
                results = results.slice(0, 10);

                angular.forEach(results, function(result) {
                    var label = result.name + ' (' + result.type.charAt(0).toUpperCase() + result.type.slice(1) + ')';
                    if (result.type === 'structure') {
                        label = result.name + ' (Project)';
                    }
                    result.name = label;
                });


                var search = {
                    name: ' <i class="fa fa-search"></i> Search for \'' + val + '\'',
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
        $rootScope.globalSearchOnSelect = function($item, $model) {
            // $rootScope.globalSearchOnSelect = function ($item, $model, $label) {
            if ($item.type === 'search') {
                // special case
                $rootScope.globalSearch.query = $item.query;
                $model = $item.query;
                $location.path('/search');
                $location.search('query', $item.query);
            } else {
                // already a result
                console.log('path is', $item.type);
                var url;
                if ($item.type === 'structure') {
                    url = '/project/summary?' + $item.type + 'Id=' + $item.encodedUri;
                } else {
                    url = '/' + $item.type + '/summary?' + $item.type + 'Id=' + $item.encodedUri;
                }

                var params = {};
                params[$item.type + 'Id'] = $item.encodedUri;
                $state.go($item.type + '.summary', params);
                console.log('url is', url);
                // $location.path(url);
            }
        };

    })
    .config(function($stateProvider, $urlRouterProvider, $httpProvider) {

        console.log('does this work?');
        $httpProvider.defaults.withCredentials = true;

        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise('/');

        $httpProvider.interceptors.push(['$q', 'toaster',
            function($q, toaster) {
                return {
                    responseError: function(rejection) {
                        // do something on error
                        console.log('got a Response ERROR!', rejection);
                        if (rejection.status === 403) {
                            toaster.pop('warning', 'You are not logged in.', 'Please log in to continue.');
                        }
                        if (rejection.status === 500) {
                            toaster.pop('error', 'Oops. Something went wrong.', 'Please contact the system administrator.');
                        }
                        return $q.reject(rejection);
                    }
                };
            }
        ]);

        // Now set up the states
        $stateProvider
            .state('attributions', {
                url: '/attributions',
                templateUrl: 'views/attributions.html'
            })
            .state('main', {
                url: '/',
                controller: 'MainCtrl',
                resolve: {
                    // Load X number of interviews
                    interviews: ['interviewRepository', 'Expression', 'GraphHelper', 'Uris', 'Architect', '$filter', 'Interview',
                        function(interviewRepository, Expression, GraphHelper, Uris, Architect, $filter, Interview) {

                            //return [];
                            return interviewRepository.getInterviewsForCarousel();

                            //console.log('resolving main');
                            //return Interview.loadAll().then(function(interviews) {
                            //    interviews = GraphHelper.graphValues(interviews);
                            //    interviews = $filter('filter')(interviews, function(interview) {
                            //        return interview.interviewees[0];
                            //    });
                            //    console.log('interview count', interviews);
                            //    // Filter only the interviews with pictures
                            //    // Looks better for the front page
                            //    var interviewsWithPictures = $filter('orderBy')(interviews, function(interview) {
                            //        if (angular.isDefined(interview.interviewees) && interview.interviewees.length && angular.isDefined(interview.interviewees[0].picture) && interview.interviewees[0].picture.file.indexOf('icon') === -1) {
                            //            return 0;
                            //        } else {
                            //            return 1;
                            //        }
                            //    });
                            //    return interviewsWithPictures;
                            //});
                        }
                    ],
                    // architects: ['Architect', 'GraphHelper', '$filter',
                    //     function (Architect, GraphHelper, $filter) {
                    //         return Architect.loadAll().then(function (architects) {
                    //             architects = GraphHelper.graphValues(architects);
                    //             return $filter('filter')(architects, function (architect) {
                    //                 return angular.isDefined(architect.picture);
                    //             });
                    //         });
                    //     }
                    // ],
                    compoundObjects: ['CompoundObject', '$filter',
                        function(CompoundObject, $filter) {
                            return CompoundObject.loadAll().then(function(compoundObjects) {
                                compoundObjects = $filter('orderBy')(compoundObjects, '-jsonData.modified');
                                compoundObjects = $filter('filter')(compoundObjects, function(compoundObject) {
                                    return angular.isDefined(compoundObject.jsonData.type);
                                });
                                console.log('compoundObjects', compoundObjects);
                                return compoundObjects;
                            });
                        }
                    ]
                },
                templateUrl: 'views/main.html'
            })
            .state('image', {
                abstract: true,
                url: '/image/:imageId',
                resolve: {
                    image: ['Expression', 'GraphHelper', '$stateParams',
                        function(Expression, GraphHelper, $stateParams) {
                            console.log('resolving');
                            var imageUri = GraphHelper.decodeUriString($stateParams.imageId);
                            return Expression.load(imageUri);
                        }
                    ],
                    depicts: ['Expression', 'Entity', 'GraphHelper', '$stateParams', 'Uris',
                        function(Expression, Entity, GraphHelper, $stateParams, Uris) {
                            var imageUri = GraphHelper.decodeUriString($stateParams.imageId);
                            return Expression.load(imageUri).then(function(expression) {
                                console.log('expression', expression);
                                // console.log('depicts', expression[Uris.QA_DEPICTS_BUILDING]);
                                if (expression[Uris.QA_DEPICTS_BUILDING]) {
                                    return Entity.load(expression[Uris.QA_DEPICTS_BUILDING]);
                                }
                                if (expression[Uris.QA_RELATED_TO]) {
                                    return Entity.load(GraphHelper.asArray(expression[Uris.QA_RELATED_TO])[0]);
                                }
                                if (expression[Uris.QA_DEPICTS_ARCHITECT]) {
                                    return Entity.load(expression[Uris.QA_DEPICTS_ARCHITECT]);
                                }
                                if (expression[Uris.QA_DEPICTS_FIRM]) {
                                    return Entity.load(expression[Uris.QA_DEPICTS_FIRM]);
                                }
                                return [];
                            });

                        }
                    ],
                    images: ['Expression', 'GraphHelper', '$stateParams', 'Uris',
                        function(Expression, GraphHelper, $stateParams, Uris) {
                            var imageUri = GraphHelper.decodeUriString($stateParams.imageId);
                            return Expression.load(imageUri).then(function(expression) {
                                var type;
                                if (GraphHelper.asArray(expression[Uris.RDF_TYPE]).indexOf(Uris.QA_PHOTOGRAPH_TYPE) !== -1) {
                                    type = 'qldarch:Photograph';
                                }
                                if (GraphHelper.asArray(expression[Uris.RDF_TYPE]).indexOf(Uris.QA_LINEDRAWING_TYPE) !== -1) {
                                    type = 'qldarch:LineDrawing';
                                }
                                console.log('type', type);
                                if (expression[Uris.QA_DEPICTS_BUILDING]) {
                                    return Expression.findByBuildingUris([expression[Uris.QA_DEPICTS_BUILDING]], type).then(function(expressions) {
                                        console.log('building expressions', expressions);
                                        return expressions;
                                    });
                                } else if (expression[Uris.QA_RELATED_TO]) {
                                    return Expression.findByArchitectUris(GraphHelper.asArray(expression[Uris.QA_RELATED_TO]), type).then(function(expressions) {
                                        console.log('architect expressions', expressions);
                                        return expressions;
                                    });
                                } else if (expression[Uris.QA_DEPICTS_ARCHITECT]) {
                                    return Expression.findByArchitectUris(GraphHelper.asArray(expression[Uris.QA_DEPICTS_ARCHITECT]), type).then(function(expressions) {
                                        console.log('architect expressions', expressions);
                                        return expressions;
                                    });
                                } else if (expression[Uris.QA_DEPICTS_FIRM]) {
                                    return Expression.findByFirmUris(GraphHelper.asArray(expression[Uris.QA_DEPICTS_FIRM]), type).then(function(expressions) {
                                        console.log('firm expressions', expressions);
                                        return expressions;
                                    });
                                } else {
                                    return [];
                                }
                            });

                        }
                    ]
                },
                controller: 'ImageCtrl',
                template: '<ui-view autoscroll="false"></ui-view>'
            })
            .state('image.view', {
                url: '',
                templateUrl: 'views/image.view.html'
            })
            .state('image.edit', {
                url: '/edit',
                templateUrl: 'views/image.edit.html'
            })
            .state('admin', {
                abstract: true,
                url: '/admin',
                template: '<ui-view autoscroll="false"></ui-view>'
            })
            .state('admin.users', {
                url: '/users',
                resolve: {
                    users: ['Uris', '$http', 'GraphHelper',
                        function(Uris, $http, GraphHelper) {
                            // Gets all users in the system and their roles
                            return $http.get(Uris.JSON_ROOT + 'user').then(function(response) {
                                return GraphHelper.graphValues(response.data);
                            });
                        }
                    ]
                },
                controller: 'AdminUsersCtrl',
                templateUrl: 'views/admin/users.html'
            })
            .state('admin.merge', {
                url: '/merge',
                controller: 'AdminMergeCtrl',
                templateUrl: 'views/admin.merge.html'
            })
            .state('user', {
                abstract: true,
                url: '/user',
                template: '<ui-view autoscroll="false"></ui-view>'
            })
            .state('user.settings', {
                url: '/settings',
                controller: 'UserSettingsCtrl',
                templateUrl: 'views/user.settings.html',
            })
            .state('user.ugcs', {
                url: '/ugcs',
                resolve: {
                    compoundObjects: ['CompoundObject', 'Auth',
                        function(CompoundObject, Auth) {
                            return Auth.status().then(function() {
                                return CompoundObject.loadForUser(Auth.user);
                            });
                        }
                    ],
                },
                controller: 'UserUgcsCtrl',
                templateUrl: 'views/user.ugcs.html'
            })
            .state('user.files', {
                abstract: true,
                url: '/files',
                templateUrl: 'views/user.files.html'
            })
            .state('user.files.images', {
                url: '/images',
                resolve: {
                    expressions: ['Expression', 'Auth', 'GraphHelper', 'Uris', '$filter',
                        function(Expression, Auth, GraphHelper, Uris, $filter) {
                            return Auth.status().then(function() {
                                return Expression.findByUser(Auth.user).then(function(expressions) {
                                    return $filter('filter')(expressions, function(expression) {
                                        return GraphHelper.asArray(expression[Uris.RDF_TYPE]).indexOf(Uris.QA_PHOTOGRAPH_TYPE) !== -1 || GraphHelper.asArray(expression[Uris.RDF_TYPE]).indexOf(Uris.QA_LINEDRAWING_TYPE) !== -1;
                                    });
                                });
                            });
                        }
                    ],
                },
                controller: 'UserFilesCtrl',
                templateUrl: 'views/user.files.images.html'
            })
            .state('user.files.documents', {
                url: '/documents',
                resolve: {
                    expressions: ['Expression', 'Auth', 'GraphHelper', 'Uris', '$filter',
                        function(Expression, Auth, GraphHelper, Uris, $filter) {
                            return Auth.status().then(function() {
                                return Expression.findByUser(Auth.user).then(function(expressions) {
                                    console.log('documents', expressions);
                                    return $filter('filter')(expressions, function(expression) {
                                        return GraphHelper.asArray(expression[Uris.RDF_TYPE]).indexOf(Uris.QA_ARTICLE_TYPE) !== -1;
                                    });
                                });
                            });
                        }
                    ],
                },
                controller: 'UserFilesDocumentsCtrl',
                templateUrl: 'views/user.files.documents.html'
            })
            .state('user.files.interviews', {
                url: '/interviews',
                resolve: {
                    expressions: ['Expression', 'Auth', 'GraphHelper', 'Uris', '$filter',
                        function(Expression, Auth, GraphHelper, Uris, $filter) {
                            return Auth.status().then(function() {
                                return Expression.findByUser(Auth.user).then(function(expressions) {
                                    // Filter out and only show the interviews
                                    return $filter('filter')(expressions, function(expression) {
                                        return GraphHelper.asArray(expression[Uris.RDF_TYPE]).indexOf(Uris.QA_INTERVIEW_TYPE) !== -1;
                                    });
                                });
                            });
                        }
                    ],
                },
                controller: 'UserFilesInterviewsCtrl',
                templateUrl: 'views/user.files.interviews.html'
            })
            .state('user.files.builds', {
                url: '/builds',
                resolve: {
                    compoundObjects: ['CompoundObject', 'Auth',
                        function(CompoundObject, Auth) {
                            return Auth.status().then(function() {
                                return CompoundObject.loadForUser(Auth.user);
                            });
                        }
                    ],
                },
                controller: 'UserUgcsCtrl',
                templateUrl: 'views/user.files.builds.html'

            })
            .state('about', {
                url: '/about',
                templateUrl: 'views/about.html',
            })
            .state('contribute', {
                url: '/contribute',
                templateUrl: 'views/contribute.html',
            })
            .state('compound', {
                url: '/compound',
                templateUrl: 'views/compound.html',
            })
            .state('register', {
                url: '/register',
                templateUrl: 'views/register.html',
                controller: 'RegisterCtrl'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .state('forgot', {
                url: '/forgot',
                templateUrl: 'views/forgot.html',
                controller: ['$scope', '$http', 'Uris',
                    function($scope, $http, Uris) {
                        $scope.reset = function(credentials) {
                            $scope.isResetting = true;
                            $http.get(Uris.JSON_ROOT + 'user/forgotPassword?username=' + encodeURIComponent(credentials.username)).then(function() {
                                $scope.isReset = true;
                            });
                        };
                    }
                ]
            })
            .state('logout', {
                url: '/logout',
                controller: 'LogoutCtrl'
            })
            .state('ugcs', {
                abstract: true,
                url: '/ugcs',
                template: '<ui-view autoscroll="false"></ui-view>'
            })
            .state('ugcs.user', {
                url: '/user/:username',
                templateUrl: 'views/ugc/usercontent.html',
                resolve: {
                    compoundObjects: ['CompoundObject', 'Auth', '$stateParams',
                        function(CompoundObject, Auth, $stateParams) {
                            return CompoundObject.loadForUser($stateParams.username);
                        }
                    ]
                },
                controller: 'UserContentCtrl'
            })
            .state('upload', {
                abstract: true,
                url: '/upload?uri&name&type',
                template: '<ui-view autoscroll="false"></ui-view>'
            })
            .state('upload.images', {
                url: '/image',
                templateUrl: 'views/files/photograph.html',
                controller: 'FilePhotographCtrl'
            })
            .state('upload.documents', {
                url: '/documents',
                templateUrl: 'views/upload.documents.html',
                controller: 'UploadDocumentsCtrl'
            })
            .state('upload.interviews', {
                url: '/interviews?id',
                resolve: {
                    interview: ['Uris', '$stateParams', 'GraphHelper', 'Interview',
                        function(Uris, $stateParams, GraphHelper, Interview) {
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
                        }
                    ]
                },
                templateUrl: 'views/upload.interviews.html',
                controller: 'UploadInterviewsCtrl'
            })
            .state('ugc', {
                abstract: true,
                url: '/ugc?id',
                resolve: {
                    compoundObject: ['$stateParams', 'GraphHelper', 'CompoundObject',
                        function($stateParams, GraphHelper, CompoundObject) {
                            if ($stateParams.id) {
                                var mapUri = GraphHelper.decodeUriString($stateParams.id);
                                return CompoundObject.load(mapUri);
                            } else {
                                return {
                                    jsonData: {
                                        data: {}
                                    }
                                };
                            }
                        }
                    ]
                },
                templateUrl: 'views/ugc/ugc.html',
            })
            .state('ugc.timeline', {
                url: '/timeline',
                views: {
                    header: {
                        templateUrl: 'views/ugc/timeline.header.html'
                    },
                    builder: {
                        template: ''
                    },
                    viewer: {
                        templateUrl: 'views/ugc/timeline.viewer.html',
                        controller: 'TimelineViewerCtrl'
                    }
                }
            })
            .state('ugc.timeline.edit', {
                url: '/edit',
                controller: 'TimelineBuilderCtrl',
                reloadOnSearch: false,
                views: {
                    'builder@ugc': {
                        templateUrl: 'views/ugc/timeline.builder.html',
                        controller: 'TimelineBuilderCtrl'
                    }
                }

            })
            .state('ugc.timeline.edit.add', {
                abstract: true,
                url: '/add',
                template: '<ui-view autoscroll="false"></ui-view>'
            })
            .state('ugc.timeline.edit.add.date', {
                url: '/date'
            })
            .state('ugc.timeline.edit.add.import', {
                url: '/import',
            })
            .state('ugc.map', {
                // abstract: true,
                url: '/map',
                views: {
                    header: {
                        templateUrl: 'views/ugc/map.header.html'
                    },
                    builder: {
                        template: ''
                    },
                    viewer: {
                        templateUrl: 'views/ugc/map.viewer.html',
                        controller: 'MapViewerCtrl'
                    }
                }
            })
            .state('ugc.map.edit', {
                url: '/edit',
                reloadOnSearch: false,
                resolve: {
                    typologies: ['Entity', 'GraphHelper',
                        function(Entity, GraphHelper) {
                            console.log('got to here!');
                            return Entity.loadAll('qldarch:BuildingTypology', true).then(function(typologies) {
                                return GraphHelper.graphValues(typologies);
                            });
                        }
                    ]
                },
                views: {
                    'builder@ugc': {
                        templateUrl: 'views/ugc/map.builder.html',
                        controller: 'MapBuilderCtrl'
                    }
                }
            })
            .state('ugc.map.edit.add', {
                abstract: true,
                url: '/add',
            })
            .state('ugc.map.edit.add.location', {
                url: '/location',
            })
            .state('ugc.map.edit.add.import', {
                url: '/import',
            })
            .state('ugc.map.edit.list', {
                url: '/list'
            })
            .state('ugc.wordcloud', {
                // abstract: true,
                url: '/wordcloud',
                views: {
                    header: {
                        templateUrl: 'views/ugc/wordcloud.header.html'
                    },
                    builder: {
                        template: ''
                    },
                    viewer: {
                        templateUrl: 'views/ugc/wordcloud.viewer.html',
                        controller: 'WordCloudViewerCtrl'
                    }
                }
            })
            .state('ugc.wordcloud.edit', {
                url: '/edit',
                controller: 'CreateMapCtrl',
                reloadOnSearch: false,
                views: {
                    'builder@ugc': {
                        templateUrl: 'views/ugc/wordcloud.builder.html',
                        controller: 'WordCloudBuilderCtrl'
                    }
                }
            })
            .state('ugc.wordcloud.edit.add', {
                abstract: true,
                url: '/add',
            })
            .state('ugc.wordcloud.edit.add.document', {
                url: '/document',
            })
            .state('ugc.wordcloud.edit.add.search', {
                url: '/search',
            })
            .state('ugc.wordcloud.edit.add.import', {
                url: '/import',
            })
            .state('others', {
                url: '/others',
                templateUrl: 'views/other/others.html',
                resolve: {
                    others: ['Entity', 'Uris', 'GraphHelper',
                        function(Entity, Uris, GraphHelper) {
                            return Entity.loadAllIncSubclass('qldarch:NonDigitalThing', true).then(function(entities) {
                                var results = [];
                                angular.forEach(entities, function(entity) {
                                    var types = GraphHelper.asArray(entity[Uris.RDF_TYPE]);

                                    if (types.indexOf(Uris.QA_ARCHITECT_TYPE) === -1 && types.indexOf(Uris.QA_FIRM_TYPE) === -1 && types.indexOf(Uris.QA_STRUCTURE_TYPE) === -1 && types.indexOf(Uris.QA_BUILDING_TYPOLOGY) === -1) {
                                        results.push(entity);
                                    }
                                });
                                return results;
                            });
                        }
                    ]
                },
                controller: 'OthersCtrl'
            })
            .state('other', {
                abstract: true,
                url: '/other?otherId',
                templateUrl: 'views/other/layout.html',
                resolve: {
                    other: ['Entity', '$stateParams', 'GraphHelper',
                        function(Entity, $stateParams, GraphHelper) {
                            console.log('loading other');
                            if (!$stateParams.otherId) {
                                console.log('no other id');
                                return {};
                            }
                            console.log('getting uri');
                            var uri = GraphHelper.decodeUriString($stateParams.otherId);
                            console.log('got to here');
                            return Entity.load(uri, false);
                        }
                    ],
                    interviews: ['Interview', '$stateParams', 'GraphHelper',
	                    function(Interview, $stateParams, GraphHelper) {
	                        if (!$stateParams.otherId) {
	                            return null;
	                        }
	                        var uri = GraphHelper.decodeUriString($stateParams.otherId);
	                        return Interview.findByIntervieweeUri(uri).then(function(interviews) {
	                            console.log('got interviews for', uri, interviews);
	                            return interviews;
	                        });
	                    }
	                 ]
                },
                controller: ['$scope', 'other', 'interviews',
                    function($scope, other, interviews) {
                        $scope.other = other;
                        $scope.interviews = interviews;
                    }
                ]
            })
            .state('other.summary', {
                url: '/summary',
                templateUrl: 'views/other/summary.html',
                resolve: {
                    types: ['Ontology',
                        function(Ontology) {
                            console.log('loading summary');
                            return Ontology.loadAllEditableEntityTypes();
                        }
                    ]
                },
                controller: 'OtherCtrl'
            })
            .state('other.summary.edit', {
                url: '/edit'
            })
            .state('other.relationships', {
                url: '/relationships',
                templateUrl: 'views/relationships.html',
                controller: 'RelationshipCtrl',
                resolve: {
                    data: ['Relationship', 'GraphHelper', 'Entity', '$stateParams',
                        function(Relationship, GraphHelper, Entity, $stateParams) {
                            var uri = GraphHelper.decodeUriString($stateParams.otherId);
                            console.log('id is', $stateParams.otherId);
                            // Get all the relationships
                            return Relationship.findByEntityUri(uri).then(function(relationships) {
                                return Relationship.getData(relationships).then(function(data) {
                                    return data;
                                });
                            });
                        }
                    ]
                }
            })
            .state('other.interview', {
                url: '/interview/:interviewId?time',
                templateUrl: 'views/other/interview.html',
                controller: 'InterviewCtrl',
                // reloadOnSearch: false,
                resolve: {
                    interview: ['$http', '$stateParams', '$q', 'Uris', 'Interview', 'Transcript', 'Relationship', 'GraphHelper', 'Entity', 'Ontology', 'File',
                        function($http, $stateParams, $q, Uris, Interview, Transcript, Relationship, GraphHelper, Entity, Ontology, File) {
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
                                    return Transcript.findWithUrl(transcriptUrl).then(function(transcript) {
                                        console.log('transcript file is', transcript);
                                        return Relationship.findByInterviewUri(interviewUri).then(function(relationships) {
                                            // Get all the subject, object, and predicate data
                                            var entities = GraphHelper.getAttributeValuesUnique(relationships, [Uris.QA_SUBJECT, Uris.QA_OBJECT]);
                                            var relatedRequests = [Entity.loadList(entities), Ontology.loadAllProperties()];

                                            return $q.all(relatedRequests).then(function(relatedData) {
                                                var entities = relatedData[0];
                                                var properties = relatedData[1];

                                                // Insert that data
                                                angular.forEach(relationships, function(relationship) {
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
                            });
                        }
                    ],
                    types: ['Ontology',
                        function(Ontology) {
                            console.log('loading summary');
                            return Ontology.loadAllEditableEntityTypes();
                        }
                    ]
                }
            })
            .state('architects', {
                abstract: true,
                url: '/architects',
                templateUrl: 'views/architects/layout.html'
                //template: '<ui-view autoscroll="false"></ui-view>'
            })
            .state('architects.queensland', {
                url: '?index',
                templateUrl: 'views/architects/architects.html',
                controller: 'ArchitectsCtrl',
                resolve: {
                    architects: ['Architect', '$filter', 'Uris', 'GraphHelper',
                        function(Architect, $filter, Uris, GraphHelper) {
                            return Architect.loadAll(false).then(function(architects) {
                                architects = GraphHelper.graphValues(architects);
                                return $filter('filter')(architects, function(architect) {
                                    return architect[Uris.QA_PRACTICED_IN_QUEENSLAND] === true;
                                });
                            });
                        }
                    ]
                }
            })
            .state('architects.other', {
                url: '/other?index',
                templateUrl: 'views/architects/architects.html',
                controller: 'ArchitectsCtrl',
                resolve: {
                    architects: ['Architect', '$filter', 'Uris', 'GraphHelper',
                        function(Architect, $filter, Uris, GraphHelper) {
                            return Architect.loadAll(false).then(function(architects) {
                                architects = GraphHelper.graphValues(architects);
                                return $filter('filter')(architects, function(architect) {
                                    return architect[Uris.QA_PRACTICED_IN_QUEENSLAND] !== true;
                                });
                            });
                        }
                    ]
                }
            })
            .state('architects.create', {
                url: '/create',
                templateUrl: 'views/architect/summary.html'
            })
            .state('architect', {
                abstract: true,
                url: '/architect?architectId',
                templateUrl: 'views/architect/layout.html',
                resolve: {
                    architect: ['Architect', '$stateParams', 'GraphHelper',
                        function(Architect, $stateParams, GraphHelper) {
                            if (!$stateParams.architectId) {
                                return {};
                            }
                            var architectUri = GraphHelper.decodeUriString($stateParams.architectId);
                            return Architect.load(architectUri, false);
                        }
                    ],
                    interviews: ['Interview', '$stateParams', 'GraphHelper',
                        function(Interview, $stateParams, GraphHelper) {
                            if (!$stateParams.architectId) {
                                return null;
                            }
                            var architectUri = GraphHelper.decodeUriString($stateParams.architectId);
                            return Interview.findByIntervieweeUri(architectUri).then(function(interviews) {
                                console.log('got interviews for', architectUri, interviews);
                                return interviews;
                            });
                        }
                    ],
                    types: ['Ontology',
                        function(Ontology) {
                            console.log('loading summary');
                            return Ontology.loadAllEditableEntityTypes();
                        }
                    ]
                },
                controller: ['$scope', 'architect', 'interviews', 'Uris', 'Entity', '$state',
                    function($scope, architect, interviews, Uris, Entity, $state) {
                        $scope.architect = architect;
                        $scope.interviews = interviews;
                        $scope.entity = architect;

                        $scope.delete = function(architect) {
                            var r = window.confirm('Delete architect ' + architect.name + '?');
                            if (r === true) {
                                Entity.delete(architect.uri).then(function() {
                                    $state.go('architects.queensland');
                                });
                            }
                        };
                    }
                ]
            })
            .state('architect.summary', {
                url: '/summary',
                templateUrl: 'views/architect/summary.html',
                controller: 'ArchitectCtrl'
            })
            .state('architect.summary.edit', {
                url: '/edit'
            })
            .state('architect.photographs', {
                url: '/photographs',
                templateUrl: 'views/architect/photographs.html',
                resolve: {
                    photographs: ['GraphHelper', 'Structure', 'Expression', '$stateParams',
                        function(GraphHelper, Structure, Expression, $stateParams) {
                            var architectUri = GraphHelper.decodeUriString($stateParams.architectId);
                            return Expression.findByArchitectUris([architectUri], 'qldarch:Photograph');
                        }
                    ]
                },
                controller: ['$scope', 'photographs', 'LayoutHelper',
                    function($scope, photographs, LayoutHelper) {
                        $scope.photographRows = LayoutHelper.group(photographs, 6);
                    }
                ]
            })
            .state('architect.articles', {
                url: '/articles',
                templateUrl: 'views/architect/articles.html',
                controller: 'ArchitectArticlesCtrl',
                resolve: {
                    articles: ['$stateParams', 'GraphHelper', 'Entity', 'Solr', '$filter',
                        function($stateParams, GraphHelper, Entity, Solr, $filter) {
                            var architectUri = GraphHelper.decodeUriString($stateParams.architectId);
                            return Entity.load(architectUri).then(function(entity) {
                                return Solr.query({
                                    query: entity.name,
                                    type: 'article'
                                }).then(function(results) {
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
                        function(Relationship, GraphHelper, Entity, $stateParams) {
                            var architectUri = GraphHelper.decodeUriString($stateParams.architectId);
                            // Get all the relationships
                            return Relationship.findByEntityUri(architectUri).then(function(relationships) {
                                return Relationship.getData(relationships).then(function(data) {
                                    console.log('data', data);
                                    return data;
                                });
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
                        function(Relationship, GraphHelper, Entity, $stateParams, $filter, Uris) {
                            var architectUri = GraphHelper.decodeUriString($stateParams.architectId);
                            // Get all the relationships
                            return Relationship.findByEntityUri(architectUri).then(function(relationships) {
                                var relationshipsWithDates = $filter('filter')(relationships, function(relationship) {
                                    return angular.isDefined(relationship[Uris.QA_START_DATE]);
                                });
                                return Relationship.getData(relationshipsWithDates);
                            });
                        }
                    ],
                    entity: ['Architect', '$stateParams', 'GraphHelper',
                        function(Architect, $stateParams, GraphHelper) {
                            var architectUri = GraphHelper.decodeUriString($stateParams.architectId);
                            return Architect.load(architectUri, false);
                        }
                    ]
                },
                controller: 'TimelineCtrl'
            })
            .state('interview', {
                url: '/interview/:interviewId?time',
                resolve: {
                    interview: ['Interview', '$state', '$stateParams', 'ngProgress',
                        function(Interview, $state, $stateParams, ngProgress) {
                            var interviewUri = atob($stateParams.interviewId);
                            ngProgress.reset();
                            return Interview.load(interviewUri).then(function(interview) {
                                var interviewee = interview.interviewees[0];
                                if (interviewee.$state == 'other') {
                                    $state.go(interviewee.$state + '.interview', {
                                        otherId: interviewee.encodedUri,
                                        interviewId: $stateParams.interviewId,
                                        time: $stateParams.time
                                    });
                                } else {
                                    $state.go(interviewee.$state + '.interview', {
                                        architectId: interviewee.encodedUri,
                                        interviewId: $stateParams.interviewId,
                                        time: $stateParams.time
                                    });
                                }
                            });
                        }
                    ]
                }
            })
            .state('architect.interview', {
                url: '/interview/:interviewId?time',
                templateUrl: 'views/architect/interview.html',
                controller: 'InterviewCtrl',
                // reloadOnSearch: false,
                resolve: {
                    interview: ['$http', '$stateParams', '$q', 'Uris', 'Architect', 'Interview', 'Transcript', 'Relationship', 'GraphHelper', 'Entity', 'Ontology', 'File',
                        function($http, $stateParams, $q, Uris, Architect, Interview, Transcript, Relationship, GraphHelper, Entity, Ontology, File) {
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
                                    return Transcript.findWithUrl(transcriptUrl).then(function(transcript) {
                                        console.log('transcript file is', transcript);
                                        return Relationship.findByInterviewUri(interviewUri).then(function(relationships) {
                                            // Get all the subject, object, and predicate data
                                            var entities = GraphHelper.getAttributeValuesUnique(relationships, [Uris.QA_SUBJECT, Uris.QA_OBJECT]);
                                            var relatedRequests = [Entity.loadList(entities), Ontology.loadAllProperties()];

                                            return $q.all(relatedRequests).then(function(relatedData) {
                                                var entities = relatedData[0];
                                                var properties = relatedData[1];

                                                // Insert that data
                                                angular.forEach(relationships, function(relationship) {
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
                        function($stateParams, GraphHelper, Uris, Structure) {

                            var architectUri = GraphHelper.decodeUriString($stateParams.architectId);

                            // Get designedBy, workedOn and 'associatedArchitect'
                            return Structure.findByAssociatedArchitectUri(architectUri);
                        }
                    ]
                },
                controller: 'ArchitectStructuresCtrl'
            })
            .state('firms', {
                abstract: true,
                url: '/firms',
                template: '<ui-view autoscroll="false"></ui-view>'
            })
            .state('firms.australian', {
                url: '?index',
                reloadOnSearch: false,
                templateUrl: 'views/firms.html',
                resolve: {
                    firms: ['Firm', '$filter', 'GraphHelper', 'Uris',
                        function(Firm, $filter, GraphHelper, Uris) {
                            return Firm.loadAll(false).then(function(firms) {
                                firms = GraphHelper.graphValues(firms);
                                return $filter('filter')(firms, function(firm) {
                                    return firm[Uris.QA_AUSTRALIAN] === true;
                                });
                            });
                        }
                    ],
                    australian: function() {
                        return true;
                    }
                },
                controller: 'FirmsCtrl'
            })
            .state('firms.other', {
                url: '/other',
                templateUrl: 'views/firms.html',
                resolve: {
                    firms: ['Firm', '$filter', 'GraphHelper', 'Uris',
                        function(Firm, $filter, GraphHelper, Uris) {
                            return Firm.loadAll(false).then(function(firms) {
                                firms = GraphHelper.graphValues(firms);
                                return $filter('filter')(firms, function(firm) {
                                    return firm[Uris.QA_AUSTRALIAN] !== true;
                                });
                            });
                        }
                    ],
                    australian: function() {
                        return false;
                    }
                },
                controller: 'FirmsCtrl'
            })
            .state('firm', {
                abstract: true,
                url: '/firm?firmId',
                templateUrl: 'views/firm/layout.html',
                resolve: {
                    firm: ['$stateParams', 'Firm', 'GraphHelper',
                        function($stateParams, Firm, GraphHelper) {
                            if (!$stateParams.firmId) {
                                return {};
                            }
                            var firmUri = GraphHelper.decodeUriString($stateParams.firmId);
                            return Firm.load(firmUri);
                        }
                    ],
                    types: ['Ontology',
                        function(Ontology) {
                            console.log('loading summary');
                            return Ontology.loadAllEditableEntityTypes();
                        }
                    ]
                },
                controller: ['$scope', 'firm', 'Entity', '$state',
                    function($scope, firm, Entity, $state) {
                        $scope.firm = firm;
                        $scope.entity = firm;

                        $scope.delete = function(firm) {
                            var r = window.confirm('Delete firm ' + firm.name + '?');
                            if (r === true) {
                                Entity.delete(firm.uri).then(function() {
                                    $state.go('firms.australian');
                                });
                            }
                        };
                    }
                ]
            })
            .state('firm.summary', {
                url: '/summary',
                templateUrl: 'views/firm/summary.html',
                controller: 'FirmCtrl'
            })
            .state('firm.summary.edit', {
                url: '/edit',
            })
            .state('firm.employees', {
                url: '/employees',
                templateUrl: 'views/firm/employees.html',
                resolve: {
                    employees: ['$stateParams', 'GraphHelper', 'Uris', 'Architect', 'Relationship',
                        function($stateParams, GraphHelper, Uris, Architect, Relationship) {
                            var firmUri = GraphHelper.decodeUriString($stateParams.firmId);

                            return Relationship.findBySubjectPredicateObject({
                                predicate: 'qldarch:employedBy',
                                object: firmUri
                            }).then(function(relationships) {
                                // Get all the architects
                                var architectUris = GraphHelper.getAttributeValuesUnique(relationships, Uris.QA_SUBJECT);
                                return Architect.loadList(architectUris, true).then(function(architects) {
                                    return GraphHelper.graphValues(architects);
                                });
                            });
                        }
                    ]
                },
                controller: ['$scope', 'firm', 'employees', 'LayoutHelper',
                    function($scope, firm, employees, LayoutHelper) {
                        $scope.firm = firm;
                        $scope.employeeRows = LayoutHelper.group(employees, 6);
                    }
                ]
            })
            .state('firm.photographs', {
                url: '/photographs',
                templateUrl: 'views/firm/photographs.html',
                resolve: {
                    photographs: ['GraphHelper', 'Firm', 'Expression', '$stateParams',
                        function(GraphHelper, Firm, Expression, $stateParams) {
                            var firmUri = GraphHelper.decodeUriString($stateParams.firmId);
                            return Expression.findByFirmUris([firmUri], 'qldarch:Photograph');
                        }
                    ]
                },
                controller: ['$scope', 'photographs', 'LayoutHelper',
                    function($scope, photographs, LayoutHelper) {
                        $scope.photographRows = LayoutHelper.group(photographs, 6);
                    }
                ]
            })
            .state('firm.structures', {
                url: '/projects',
                templateUrl: 'views/firm/structures.html',
                resolve: {
                    structures: ['$stateParams', 'GraphHelper', 'Uris', 'Structure', 'Relationship',
                        function($stateParams, GraphHelper, Uris, Structure, Relationship) {
                            var firmUri = GraphHelper.decodeUriString($stateParams.firmId);
                            return Relationship.findBySubjectPredicateObject({
                                predicate: 'qldarch:designedBy',
                                object: firmUri
                            }).then(function(relationships) {
                                // Get all the architects
                                var structureUris = GraphHelper.getAttributeValuesUnique(relationships, Uris.QA_SUBJECT);

                                return Structure.loadList(structureUris, true).then(function(structures) {
                                    var relationshipStructures = GraphHelper.graphValues(structures);

                                    // Get the associated firms...this is awful
                                    // should be all relationships or nothing!
                                    return Structure.findByAssociatedFirmUri(firmUri).then(function(firmStructures) {
                                        var structures = angular.extend(relationshipStructures, firmStructures);
                                        return GraphHelper.graphValues(structures);
                                    });
                                });
                            });
                        }
                    ]
                },
                controller: ['$scope', 'firm', 'structures', 'LayoutHelper',
                    function($scope, firm, structures, LayoutHelper) {
                        $scope.firm = firm;
                        $scope.structureRows = LayoutHelper.group(structures, 6);
                    }
                ]
            })
            .state('firm.articles', {
                url: '/articles',
                templateUrl: 'views/architect/articles.html',
                resolve: {
                    articles: ['$stateParams', 'GraphHelper', 'Entity', 'Solr', '$filter',
                        function($stateParams, GraphHelper, Entity, Solr, $filter) {
                            var firmUri = GraphHelper.decodeUriString($stateParams.firmId);
                            return Entity.load(firmUri).then(function(entity) {
                                return Solr.query({
                                    query: entity.name,
                                    type: 'article'
                                }).then(function(results) {
                                    return $filter('filter')(results, {
                                        'type': 'article'
                                    });
                                });
                            });
                        }
                    ]
                },
                controller: ['$scope', 'articles',
                    function($scope, articles) {
                        $scope.articles = articles;
                    }
                ]
            })
            .state('firm.relationships', {
                url: '/relationships',
                templateUrl: 'views/relationships.html',
                resolve: {
                    data: ['Relationship', 'GraphHelper', 'Entity', '$stateParams',
                        function(Relationship, GraphHelper, Entity, $stateParams) {
                            var firmUri = GraphHelper.decodeUriString($stateParams.firmId);
                            // Get all the relationships
                            return Relationship.findByEntityUri(firmUri).then(function(relationships) {
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
                        function(Relationship, GraphHelper, Entity, $stateParams, $filter, Uris) {

                            var firmUri = GraphHelper.decodeUriString($stateParams.firmId);
                            // Get all the relationships
                            return Relationship.findByEntityUri(firmUri).then(function(relationships) {
                                var relationshipsWithDates = $filter('filter')(relationships, function(relationship) {
                                    return angular.isDefined(relationship[Uris.QA_START_DATE]);
                                });
                                return Relationship.getData(relationshipsWithDates);
                            });
                        }
                    ],
                    entity: ['Firm', '$stateParams', 'GraphHelper',
                        function(Firm, $stateParams, GraphHelper) {
                            var firmUri = GraphHelper.decodeUriString($stateParams.firmId);
                            return Firm.load(firmUri, false);
                        }
                    ]
                },
                controller: 'TimelineCtrl'
            })
            .state('structures', {
                abstract: true,
                url: '/projects',
                template: '<ui-view autoscroll="false"></ui-view>'
            })
            .state('structures.australian', {
                url: '?index',
                templateUrl: 'views/structures.html',
                controller: 'StructuresCtrl',
                resolve: {
                    structures: ['Structure', '$filter', 'GraphHelper', 'Uris',
                        function(Structure, $filter, GraphHelper, Uris) {
                            return Structure.loadAll(false).then(function(structures) {
                                structures = GraphHelper.graphValues(structures);
                                console.log('got structures', structures);
                                return $filter('filter')(structures, function(structure) {
                                    return structure[Uris.QA_AUSTRALIAN] === true;
                                });
                            });
                        }
                    ]
                }
            })
            .state('structures.other', {
                url: '/other?index',
                templateUrl: 'views/structures.html',
                controller: 'StructuresCtrl',
                resolve: {
                    structures: ['Structure', '$filter', 'GraphHelper', 'Uris',
                        function(Structure, $filter, GraphHelper, Uris) {
                            return Structure.loadAll(false).then(function(structures) {
                                structures = GraphHelper.graphValues(structures);
                                return $filter('filter')(structures, function(structure) {
                                    return structure[Uris.QA_AUSTRALIAN] !== true;
                                });
                            });
                        }
                    ]
                }
            })
            .state('structure', {
                // http://qldarch-test.metadata.net/beta/#/project/aHR0cDovL3FsZGFyY2gubmV0L3JkZi8yMDEyLTEyL3Jlc291cmNlcy9idWlsZGluZ3MvMzE=
                abstract: true,
                url: '/project?structureId',
                templateUrl: 'views/structure/layout.html',
                resolve: {
                    structure: ['$http', '$stateParams', 'Uris', 'Structure', 'GraphHelper',
                        function($http, $stateParams, Uris, Structure, GraphHelper) {
                            if ($stateParams.structureId) {
                                var structureUri = GraphHelper.decodeUriString($stateParams.structureId);
                                return Structure.load(structureUri);
                            } else {
                                return {};
                            }
                        }
                    ],
                    types: ['Ontology',
                        function(Ontology) {
                            console.log('loading summary');
                            return Ontology.loadAllEditableEntityTypes();
                        }
                    ]
                },
                controller: ['$scope', 'structure', 'Entity', '$state',
                    function($scope, structure, Entity, $state) {
                        $scope.structure = structure;
                        $scope.entity = structure;

                        $scope.delete = function(structure) {
                            var r = window.confirm('Delete project ' + structure.name + '?');
                            if (r === true) {
                                Entity.delete(structure.uri).then(function() {
                                    $state.go('structures.australian');
                                });
                            }
                        };
                    }
                ]
            })
            .state('structure.summary', {
                url: '/summary',
                templateUrl: 'views/structure/summary.html',
                resolve: {
                    designers: ['$stateParams', 'GraphHelper', 'Uris', 'Entity', 'Relationship', '$filter',
                        function($stateParams, GraphHelper, Uris, Entity, Relationship, $filter) {
                            var designers = {
                                architects: [],
                                firms: []
                            };

                            if (!$stateParams.structureId) {
                                return designers;
                            }

                            var structureUri = GraphHelper.decodeUriString($stateParams.structureId);



                            return Relationship.findBySubjectPredicateObject({
                                predicate: 'qldarch:designedBy',
                                subject: structureUri
                            }).then(function(relationships) {
                                // Get all the architects
                                var designerUris = GraphHelper.getAttributeValuesUnique(relationships, Uris.QA_OBJECT);
                                if (designerUris.length) {
                                    return Entity.loadList(designerUris, false).then(function(entities) {
                                        entities = GraphHelper.graphValues(entities);
                                        designers.architects = $filter('filter')(entities, function(entity) {
                                            return entity.type === 'architect';
                                        });
                                        designers.firms = $filter('filter')(entities, function(entity) {
                                            return entity.type === 'firm';
                                        });
                                        return designers;
                                    });
                                } else {
                                    return designers;
                                }
                            });
                        }
                    ]
                },
                controller: 'StructureCtrl'
            })
            .state('structure.summary.edit', {
                url: '/edit'
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
                        function(GraphHelper, Structure, Expression, $stateParams) {
                            var structureUri = GraphHelper.decodeUriString($stateParams.structureId);
                            return Expression.findByBuildingUris([structureUri], 'qldarch:Photograph');
                        }
                    ]
                },
                controller: ['$scope', 'photographs', 'LayoutHelper',
                    function($scope, photographs, LayoutHelper) {
                        $scope.photographRows = LayoutHelper.group(photographs, 6);
                    }
                ]
            })
            .state('structure.photograph', {
                url: '/photograph/:photographId',
                templateUrl: 'views/photograph.html',
                resolve: {
                    photograph: ['Expression', '$stateParams', 'GraphHelper', 'Uris', 'Structure',
                        function(Expression, $stateParams, GraphHelper, Uris, Structure) {
                            var photographUri = GraphHelper.decodeUriString($stateParams.photographId);
                            return Expression.load(photographUri, 'qldarch:Photograph').then(function(photograph) {
                                // Loading building if its there
                                if (angular.isDefined(photograph[Uris.QA_DEPICTS_BUILDING])) {
                                    return Structure.load(photograph[Uris.QA_DEPICTS_BUILDING]).then(function(structure) {
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
            .state('structure.photograph.edit', {
                url: '/edit',
                // templateUrl: 'views/photograph.edit.html',
                // controller: 'PhotographEditCtrl'
            })
            .state('structure.lineDrawings', {
                url: '/line-drawings',
                templateUrl: 'views/structure/linedrawings.html',
                resolve: {
                    lineDrawings: ['GraphHelper', '$stateParams', 'Expression',
                        function(GraphHelper, $stateParams, Expression) {
                            var structureUri = GraphHelper.decodeUriString($stateParams.structureId);
                            return Expression.findByBuildingUris([structureUri], 'qldarch:LineDrawing');
                        }
                    ]
                },
                controller: ['$scope', 'lineDrawings', 'LayoutHelper',
                    function($scope, lineDrawings, LayoutHelper) {
                        $scope.lineDrawingRows = LayoutHelper.group(lineDrawings, 6);
                    }
                ]
            })
            .state('structure.lineDrawing', {
                url: '/line-drawing/:lineDrawingId',
                templateUrl: 'views/linedrawing.html',
                resolve: {
                    lineDrawing: ['Expression', '$stateParams', 'GraphHelper', 'Uris', 'Structure',
                        function(Expression, $stateParams, GraphHelper, Uris, Structure) {
                            var lineDrawingUri = GraphHelper.decodeUriString($stateParams.lineDrawingId);
                            return Expression.load(lineDrawingUri, 'qldarch:LineDrawing').then(function(lineDrawing) {
                                // Loading building if its there
                                if (angular.isDefined(lineDrawing[Uris.QA_DEPICTS_BUILDING])) {
                                    return Structure.load(lineDrawing[Uris.QA_DEPICTS_BUILDING]).then(function(structure) {
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
                    function($scope, lineDrawing) {
                        $scope.lineDrawing = lineDrawing;
                    }
                ]
            })
            .state('structure.articles', {
                url: '/articles',
                templateUrl: 'views/architect/articles.html',
                resolve: {
                    articles: ['$stateParams', 'GraphHelper', 'Entity', 'Solr', '$filter',
                        function($stateParams, GraphHelper, Entity, Solr, $filter) {
                            var structureId = GraphHelper.decodeUriString($stateParams.structureId);
                            return Entity.load(structureId).then(function(entity) {
                                return Solr.query({
                                    query: entity.name,
                                    type: 'article'
                                }).then(function(results) {
                                    return $filter('filter')(results, {
                                        'type': 'article'
                                    });
                                });
                            });
                        }
                    ]
                },
                controller: ['$scope', 'articles',
                    function($scope, articles) {
                        $scope.articles = articles;
                    }
                ]
            })
            .state('structure.timeline', {
                url: '/timeline',
                templateUrl: 'views/timeline.html',
                resolve: {
                    data: ['Relationship', 'GraphHelper', 'Entity', '$stateParams', '$filter', 'Uris',
                        function(Relationship, GraphHelper, Entity, $stateParams, $filter, Uris) {

                            var structureUri = GraphHelper.decodeUriString($stateParams.structureId);
                            // Get all the relationships
                            return Relationship.findByEntityUri(structureUri).then(function(relationships) {
                                var relationshipsWithDates = $filter('filter')(relationships, function(relationship) {
                                    return angular.isDefined(relationship[Uris.QA_START_DATE]);
                                });
                                return Relationship.getData(relationshipsWithDates);
                            });
                        }
                    ],
                    entity: ['Structure', '$stateParams', 'GraphHelper',
                        function(Structure, $stateParams, GraphHelper) {
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
                        function(Relationship, GraphHelper, Entity, $stateParams) {
                            var structureUri = GraphHelper.decodeUriString($stateParams.structureId);
                            // Get all the relationships
                            return Relationship.findByEntityUri(structureUri).then(function(relationships) {
                                return Relationship.getData(relationships);
                            });
                        }
                    ]
                },
                controller: 'RelationshipCtrl'
            })
            .state('interviews', {
                url: '/interviews',
                templateUrl: 'views/interviews.html',
                resolve: {
                    // @todo: change this for building
            		interviews: ['Expression', 'GraphHelper', 'Uris', 'Architect', '$filter', 'Interview',
                         function(Expression, GraphHelper, Uris, Architect, $filter, Interview) {
                             return Interview.loadAll().then(function(interviews) {
                                 interviews = GraphHelper.graphValues(interviews);
                                 interviews = $filter('filter')(interviews, function(interview) {
                                	 return interview.interviewees[0];
                                 });
                                 
                                 interviews = $filter('orderBy')(interviews, function(interview) {
                                     return interview.interviewees[0].encodedUri;
                                 });
                                 
                                 for(var i = interviews.length - 1; i >= 1; i--) {
                                	 if(interviews[i].interviewees[0] == interviews[i - 1].interviewees[0]) {
                                		 interviews.splice(i, 1);
                                     }
                                 }
                                 
                                 console.log('interview count', interviews);
                                 // Filter only the interviews with pictures
                                 // Looks better for the front page
                                 var interviewsWithPictures = $filter('orderBy')(interviews, function(interview) {
                                     if (angular.isDefined(interview.interviewees) && interview.interviewees.length 
                                    		 && angular.isDefined(interview.interviewees[0].picture) 
                                    		 && interview.interviewees[0].picture.file.indexOf('icon') === -1) {
                                         return 0;
                                     } else {
                                         return 1;
                                     }
                                 });
                                 
                                 return interviewsWithPictures;
                             });
                         }
                     ],
                },
                controller: 'InterviewsCtrl'
            })
            .state('articles', {
                url: '/articles',
                templateUrl: 'views/articles.html',
                resolve: {
                    // @todo: change this for building
                    articles: ['Expression',
                        function(Expression) {
                            return Expression.loadAll('qldarch:Article');
                        }
                    ]
                },
                controller: ['$scope', 'articles',
                    function($scope, articles) {
                        $scope.articles = articles;
                    }
                ]
            })
            .state('article', {
                url: '/article?articleId',
                templateUrl: 'views/article.html',
                resolve: {
                    // @todo: change this for building
                    article: ['Expression', 'GraphHelper', '$stateParams',
                        function(Expression, GraphHelper, $stateParams) {
                            console.log('loading article');
                            var articleUri = GraphHelper.decodeUriString($stateParams.articleId);
                            console.log('loading article', articleUri);
                            return Expression.load(articleUri, 'qldarch:Article');
                        }
                    ]
                },
                controller: 'ArticleCtrl'
            })
            .state('article.edit', {
                url: '/edit'
            })
            .state('search', {
                url: '/search?query',
                templateUrl: 'views/search.html',
                controller: 'SearchCtrl'
                // ,
                // resolve: {
                //     results: ['$stateParams', 'Solr',
                //         function($stateParams, Solr) {
                //             var query = $stateParams.query;
                //
                //             return Solr.query({
                //                 query: query,
                //             });
                //         }
                //     ]
                // }
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
