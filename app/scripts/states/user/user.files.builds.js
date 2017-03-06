'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('user.files.builds', {
    url : '/builds',
    resolve : {
      compoundObjects : [ 'CompoundObject', 'Auth', function(CompoundObject, Auth) {
        return Auth.status().then(function() {
          return CompoundObject.loadForUser(Auth.user.username);
        });
      } ],
    },
    controller : 'UserUgcsCtrl',
    templateUrl : 'views/user.files.builds.html'
  });
});