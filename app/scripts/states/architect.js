'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('architect', {
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
});
});