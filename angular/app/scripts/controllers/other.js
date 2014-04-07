'use strict';

angular.module('angularApp')
    .controller('OtherCtrl', function ($scope, other, types, $state, Entity, Uris) {
        $scope.other = other;
        $scope.types = types;

        $scope.updateOther = function (other) {
            if (other.uri) {
                // PUT
                Entity.update(other.uri, other).
                catch (function (error) {
                    alert('Failed to save');
                    console.log('Failed to save', error);
                    $state.go('other.summary.edit', {
                        otherId: other.encodedUri
                    });
                });

                $state.go('other.summary', {
                    architectId: other.encodedUri
                });
            } else {
                // POST
                Entity.create(other, other[Uris.RDF_TYPE]).then(function (other) {
                    $state.go('other.summary', {
                        otherId: other.encodedUri
                    });
                });
            }
        };

        $scope.cancel = function () {
            if (other.uri) {
                $state.go('other.summary');
            } else {
                $state.go('main');
            }
        };

        /**
         * ======================================================
         *
         * Select Box for Types
         *
         * ======================================================
         */
        $scope.other.$type = null;
        angular.forEach(types, function (type) {
            if (type.uri === other[Uris.RDF_TYPE]) {
                $scope.other.$type = {
                    id: type.uri,
                    uri: type.uri,
                    text: type[Uris.QA_LABEL],
                    name: type[Uris.QA_LABEL],
                    encodedUri: type.encodedUri,
                };
            }
        });
        $scope.$watch('other.$type', function (type) {
            // Delete all typologies on the structure
            if (type) {
                other[Uris.RDF_TYPE] = type.uri;
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
                    if (type.uri !== Uris.QA_ARCHITECT_TYPE && type.uri !== Uris.QA_STRUCTURE_TYPE && type.uri !== Uris.QA_FIRM_TYPE) {
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