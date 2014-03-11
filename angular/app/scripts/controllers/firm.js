'use strict';

angular.module('angularApp')
    .controller('FirmCtrl', function ($scope, firm, Entity, $state) {
        $scope.firm = firm;

        $scope.updateFirm = function (firm) {
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
        };

    });