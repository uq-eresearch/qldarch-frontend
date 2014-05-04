'use strict';

angular.module('angularApp')
    .controller('AdminUsersCtrl', function ($scope, users, $http, Uris) {
        $scope.users = users;

        $scope.saveUser = function (user) {
            user.$isSaving = true;
            console.log('user is', user);
            $http.put(Uris.JSON_ROOT + 'user/role', jQuery.param({
                username: user.username,
                role: user.role
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function (response) {
                console.log('response', response);
                user.$isSaving = false;
                user.$isChanged = false;
            });
        };
    });