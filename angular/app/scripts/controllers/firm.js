'use strict';

angular.module('angularApp')
    .controller('FirmCtrl', function ($scope, firm, types, Entity, $state, Uris) {
        $scope.firm = firm;

        function goToTypePage(typeUri) {
            if (typeUri === Uris.QA_ARCHITECT_TYPE) {
                $state.go('architect.summary', {
                    architectId: firm.encodedUri
                });
            } else if (typeUri === Uris.QA_FIRM_TYPE) {
                $state.go('firm.summary', {
                    firmId: firm.encodedUri
                });
            } else if (typeUri === Uris.QA_STRUCTURE_TYPE) {
                $state.go('structure.summary', {
                    structureId: firm.encodedUri
                });
            } else {
                $state.go('other.summary', {
                    otherId: firm.encodedUri
                });
            }
        }

        $scope.updateFirm = function (firm) {
            if (firm.uri) {
                // PUT
                Entity.update(firm.uri, firm).
                catch (function (error) {
                    alert('Failed to save');
                    console.log('Failed to save', error);
                    $state.go('firm.summary.edit', {
                        firmId: firm.encodedUri
                    });
                });
                goToTypePage($scope.firm[Uris.RDF_TYPE]);
            } else {
                // POST
                Entity.create(firm, Uris.QA_FIRM_TYPE).then(function () {
                    goToTypePage($scope.firm[Uris.RDF_TYPE]);
                });
            }
        };

        $scope.cancel = function () {
            if (firm.uri) {
                $state.go('firm.summary');
            } else {
                $state.go('firms.australian');
            }
        };


        /**
         * ======================================================
         *
         * Select Box for Types
         *
         * ======================================================
         */
        $scope.firm.$type = null;
        angular.forEach(types, function (type) {
            if (type.uri === Uris.QA_FIRM_TYPE) {
                $scope.firm.$type = {
                    id: type.uri,
                    uri: type.uri,
                    text: type[Uris.QA_LABEL],
                    name: type[Uris.QA_LABEL],
                    encodedUri: type.encodedUri,
                };
            }
        });
        $scope.$watch('firm.$type', function (type) {
            // Delete all typologies on the structure
            if (type) {
                $scope.firm[Uris.RDF_TYPE] = type.uri;
            }
        });
        $scope.typeSelect = {
            placeholder: 'Select a Type',
            dropdownAutoWidth: true,
            multiple: false,
            query: function (options) {
                var data = {
                    results: []
                };
                angular.forEach(types, function (type) {
                    if (type.uri !== Uris.QA_BUILDING_TYPOLOGY && type[Uris.QA_LABEL].toLowerCase().indexOf(options.term.toLowerCase()) !== -1) {
                        data.results.push({
                            id: type.uri,
                            uri: type.uri,
                            text: type[Uris.QA_LABEL],
                            name: type[Uris.QA_LABEL],
                            encodedUri: type.encodedUri,
                        });
                    }
                });
                options.callback(data);
            }
        };


    });