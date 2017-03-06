'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('user.ugcs', {
    url : '/ugcs',
    resolve : {
      compoundObjects : [ 'CompoundObject', 'Auth', function(CompoundObject, Auth) {
        return Auth.status().then(function() {
          return CompoundObject.loadForUser(Auth.user.username);
        });
      } ],
    },
    controller : 'UserUgcsCtrl',
    templateUrl : 'views/user.ugcs.html'
  });
});