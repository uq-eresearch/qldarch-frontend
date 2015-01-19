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

        this.isUQSLQ = function () {
            return this.user && ((that.user.indexOf('uq') !== -1 || that.user.indexOf('slq') !== -1) || that.role === 'root');
        };

        /**
         * Checks if the current user can delete something
         *
         * @param  {[type]} uri [description]
         * @return {[type]}     [description]
         */
        this.canDelete = function (uri) {
            return this.role === 'root' || (this.user && uri.indexOf(this.user) !== -1);
        };

        this.isEditor = function () {
            return this.role === 'editor' || this.role === 'root';
        };

        this.clear = function() {
          // remove all properties from this singleton. from http://stackoverflow.com/a/19316998
          for(var k in this) if(!this[k].constructor.toString().match(/^function Function\(/)) delete this[k];
        };

    });