'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('user.files.builds', {
    url : '/builds',
    resolve : {
      compoundObjects : [ 'CompObj', '$filter', 'Auth', function(CompObj, $filter, Auth) {
        return CompObj.loadAll().then(function(compoundObjects) {
          compoundObjects = $filter('orderBy')(compoundObjects, function(compoundObject) {
            return compoundObject.modified;
          });
          compoundObjects = $filter('filter')(compoundObjects, function(compoundObject) {
            return angular.isDefined(compoundObject.type);
          });
          compoundObjects = $filter('filter')(compoundObjects, function(compoundObject) {
            return compoundObject.user === Auth.user.displayName;
          });
          return compoundObjects;
        });
      } ]
    },
    controller : 'UserUgcsCtrl',
    templateUrl : 'views/user/user.files.builds.html'
  });
});