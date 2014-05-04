'use strict';

angular.module('angularApp')
    .controller('LoginCtrl', function ($scope, Uris, $http, Auth, $state) {
        $scope.credentials = {};

        /**
         * Logins in the user
         * @param  {[type]} credentials Object with username and password
         * @return {[type]}             [description]
         */
        $scope.login = function (credentials) {
            $http.post(Uris.JSON_ROOT + 'login', jQuery.param({
                username: credentials.username,
                password: credentials.password
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function (response) {
                angular.extend(Auth, response.data);
                console.log('going to main!');
                $state.go('main');
            }, function (error) {
                alert('Sorry, that email and password is incorrect.');
                console.log('failed to log in', error);
            });
        };
    });