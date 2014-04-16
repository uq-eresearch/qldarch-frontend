'use strict';

angular.module('angularApp')
    .controller('AdminMergeCtrl', function ($scope, Entity, $http, Uris, toaster, $state) {

        $scope.merge = function () {
            // /ws/rest/entity/merge?intoResource=<intoResource>&fromResource=<fromResource>.
            $http.put(Uris.JSON_ROOT + 'entity/merge?intoResource=' + encodeURIComponent($scope.to.uri) + '&fromResource=' + encodeURIComponent($scope.from.uri)).then(function () {
                toaster.pop('success', 'Relationships Merged', 'You have successfully merged relationships.');
                $state.go($scope.to.entity.$state + '.relationships', $scope.to.entity.$stateParams);
            }, function () {
                toaster.pop('error', 'Error occured.', 'Sorry, we couldn\t merge relationships at this time.');
            });
        };

        /*
        =====================================================
            Select2 Boxes
        =====================================================
         */
        // Setup the entity select boxes
        $scope.entitySelect = {
            placeholder: 'Architect, Project, Firm or Other',
            dropdownAutoWidth: true,
            multiple: false,
            // minimumInputLength: 2,
            query: function (options) {
                Entity.findByName(options.term, false).then(function (entities) {
                    var data = {
                        results: []
                    };

                    angular.forEach(entities, function (entity) {
                        var label = entity.name + ' (' + entity.type.charAt(0).toUpperCase() + entity.type.slice(1) + ')';
                        if (entity.type === 'buildingtypology') {
                            label = entity.name + ' (Building typology)';
                        }
                        if (entity.type === 'structure') {
                            label = entity.name + ' (Project)';
                        }
                        data.results.push({
                            id: entity.uri,
                            uri: entity.uri,
                            text: label,
                            type: entity.type,
                            name: entity.name,
                            encodedUri: entity.encodedUri,
                            entity: entity
                        });

                    });
                    options.callback(data);
                });
            }
        };

    });