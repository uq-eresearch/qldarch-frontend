'use strict';

angular.module('angularApp')
    .service('Auth', function Auth($http, Uris, $q) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        var that = this;
        this.status = function () {
            return $http.get(Uris.JSON_ROOT + 'login/status').then(function (status) {
                angular.extend(that, status.data);

                if (status.data.auth) {
                    console.log('Auth is', that.user, status.data.user);
                    return true;
                } else {
                    console.log('rejecting!');
                    return $q.reject();
                }
            });
        };
    });