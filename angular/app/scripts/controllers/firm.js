'use strict';

angular.module('angularApp')
    .controller('FirmCtrl', function ($scope, firm, Entity, $state, Uris) {
        $scope.firm = firm;

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
                $state.go('firm.summary', {
                    architectId: firm.encodedUri
                });
            } else {
                // POST
                Entity.create(firm, Uris.QA_FIRM_TYPE).then(function (firm) {
                    $state.go('firm.summary', {
                        firmId: firm.encodedUri
                    });
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

    });