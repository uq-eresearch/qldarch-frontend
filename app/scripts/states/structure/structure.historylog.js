'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('structure.historylog', {
    url : '/historylog',
    templateUrl : 'views/structure/historylog.html',
    resolve : {
      users : [ 'Uris', '$http', function(Uris, $http) {
        // Gets all users in the system and their roles
        return $http.get(Uris.WS_ROOT + 'accounts/all').then(function(response) {
          return response.data;
        });
      } ],
      structurehstlog : [ '$stateParams', 'Uris', '$http', 'users', function($stateParams, Uris, $http, users) {
        /* globals $:false */
        var payload = {
          oid : $stateParams.structureId
        };
        return $http({
          method : 'POST',
          url : Uris.WS_ROOT + 'archobjversion',
          headers : {
            'Content-Type' : 'application/x-www-form-urlencoded'
          },
          withCredentials : true,
          transformRequest : function(obj) {
            return $.param(obj, true);
          },
          data : payload
        }).then(function(response) {
          angular.forEach(response.data, function(d) {
            angular.forEach(users, function(user) {
              if (d.owner === user.id) {
                d.username = user.username;
                d.email = user.email;
              }
            });
            var doc = JSON.parse(d.document);
            d.document = doc;
          });
          return response.data;
        }, function(response) {
          console.log('error message: ' + response.data.msg);
        });
      } ]
    },
    controller : [ '$scope', 'structurehstlog', 'ObjectDiff', function($scope, structurehstlog, ObjectDiff) {
      $scope.structureHistoryLog = structurehstlog;
      for (var i = 0; i < $scope.structureHistoryLog.length; i++) {
        var prev = i;
        var curr = i;
        if (i > 0) {
          prev = i - 1;
        }
        ObjectDiff.setOpenChar('');
        ObjectDiff.setCloseChar('');
        var diff = ObjectDiff.diffOwnProperties($scope.structureHistoryLog[prev].document, $scope.structureHistoryLog[curr].document);
        $scope.structureHistoryLog[i].diffValue = ObjectDiff.toJsonView(diff);
        $scope.structureHistoryLog[i].diffValueChanges = ObjectDiff.toJsonDiffView(diff);
      }
    } ]
  });
});