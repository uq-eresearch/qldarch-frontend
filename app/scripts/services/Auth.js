'use strict';

angular.module('qldarchApp').service('Auth', function Auth($http, Uris, $q) {
  // AngularJS will instantiate a singleton by calling "new" on this function
  var that = this;
  this.status = function() {
    return $http.get(Uris.JSON_ROOT + 'user').then(function(status) {
      if (status.data.id) {
        that.success = true;
        that.user = status.data;
        console.log('Auth is', that.user.username, status.data.username);
        return true;
      } else {
        console.log('rejecting!');
        return $q.reject();
      }
    });
  };

  this.isUQSLQ = function() {
    if (angular.isDefined(this.user)) {
      if (this.user && ((that.user.username.indexOf('uq') !== -1 || that.user.username.indexOf('slq') !== -1) || that.user.role === 'admin')) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  /**
   * Checks if the current user can delete something
   * 
   * @param {[type]}
   *          uri [description]
   * @return {[type]} [description]
   */
  this.canDelete = function() {
    if (angular.isDefined(this.user)) {
      if (this.user.role === 'admin') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  this.isEditor = function() {
    if (angular.isDefined(this.user)) {
      if (this.user.role === 'editor' || this.user.role === 'admin') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  this.clear = function() {
    // remove all properties from this singleton. from
    // http://stackoverflow.com/a/19316998
    for ( var k in this) {
      if (!this[k].constructor.toString().match(/^function Function\(/)) {
        delete this[k];
      }
    }
  };

});