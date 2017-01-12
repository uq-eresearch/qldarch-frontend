'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('structure', {
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
});
});