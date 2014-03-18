'use strict';

angular.module('angularApp')
    .controller('RegisterCtrl', function ($scope, $http, Uris) {
        $scope.user = {};

        $scope.createUser = function (user) {
            $http.post(Uris.JSON_ROOT + 'user', jQuery.param(user), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function (response) {
                console.log('response', response);
            });
            $scope.user = {};
        };

    });