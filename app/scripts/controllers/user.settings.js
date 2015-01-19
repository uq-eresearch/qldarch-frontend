'use strict';

angular.module('angularApp')
    .controller('UserSettingsCtrl', function ($scope, Auth, toaster, Uris, $http, $state) {
        $scope.user = {};
        $scope.user.username = Auth.user;
        $scope.user.email = Auth.email;

        $scope.update = function () {
            $scope.user.username = Auth.user;
            $scope.user.email = Auth.email;

            $http.put(Uris.JSON_ROOT + 'user', jQuery.param($scope.user), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function () {
                // User saved
                $state.go('main');
                toaster.pop('success', 'Password Updated', 'You have successfully updated your password.');
            }, function () {
                toaster.pop('error', 'Error occured.', 'Sorry, we couldn\t update your password at this time');
            });
        };
    });