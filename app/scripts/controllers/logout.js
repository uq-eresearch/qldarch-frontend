'use strict';

angular.module('angularApp')
    .controller('LogoutCtrl', function ($scope, $http, Uris, Auth, $state) {
        $http.post(Uris.JSON_ROOT + 'logout').then(function (response) {
            Auth.clear();
            angular.extend(Auth, response.data);
            $state.go('main');
        });
    });