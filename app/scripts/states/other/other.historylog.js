'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('other.historylog', {
    url : '/historylog',
    templateUrl : 'views/other/historylog.html',
    resolve : {
      users : [ 'Uris', '$http', function(Uris, $http) {
        // Gets all users in the system and their roles
        return $http.get(Uris.WS_ROOT + 'accounts/all').then(function(response) {
          return response.data;
        });
      } ],
      otherhstlog : [ '$stateParams', 'Uris', '$http', 'users', function($stateParams, Uris, $http, users) {
        /* globals $:false */
        var payload = {
          oid : $stateParams.otherId
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
            delete d.document.id;
            delete d.document.created;
            delete d.document.type;
            if (angular.isDefined(d.document.label)) {
              d.document.Name = d.document.label;
              delete d.document.label;
            }
            if (angular.isDefined(d.document.firstname)) {
              d.document['First Name'] = d.document.firstname;
              delete d.document.firstname;
            }
            if (angular.isDefined(d.document.lastname)) {
              d.document['Last Name'] = d.document.lastname;
              delete d.document.lastname;
            }
            if (angular.isDefined(d.document.summary)) {
              d.document.Summary = d.document.summary;
              delete d.document.summary;
            }
            if (angular.isDefined(d.document.architect)) {
              delete d.document.architect;
            }
            if (angular.isDefined(d.document.practicedinqueensland)) {
              delete d.document.practicedinqueensland;
            }
          });
          return response.data;
        }, function(response) {
          console.log('error message: ' + response.data.msg);
        });
      } ]
    },
    controller : [ '$scope', 'otherhstlog', 'ObjectDiff', function($scope, otherhstlog, ObjectDiff) {
      $scope.otherHistoryLog = otherhstlog;
      for (var i = 0; i < $scope.otherHistoryLog.length; i++) {
        var prev = i;
        var curr = i;
        if (i > 0) {
          prev = i - 1;
        }
        ObjectDiff.setOpenChar('');
        ObjectDiff.setCloseChar('');
        var diff = ObjectDiff.diffOwnProperties($scope.otherHistoryLog[prev].document, $scope.otherHistoryLog[curr].document);
        $scope.otherHistoryLog[i].diffValue = ObjectDiff.toJsonView(diff);
        $scope.otherHistoryLog[i].diffValueChanges = ObjectDiff.toJsonDiffView(diff);
      }
    } ]
  });
});