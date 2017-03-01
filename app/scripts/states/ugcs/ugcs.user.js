'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('ugcs.user', {
    url : '/user/:username',
    templateUrl : 'views/ugc/usercontent.html',
    resolve : {
      compoundObjects : [ 'CompoundObject', 'Auth', '$stateParams', function(CompoundObject, Auth, $stateParams) {
        return CompoundObject.loadForUser($stateParams.username);
      } ]
    },
    controller : 'UserContentCtrl'
  });
});