'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('firm', {
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
});
});