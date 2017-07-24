'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('firm.historylog', {
    url : '/historylog',
    templateUrl : 'views/firm/historylog.html',
    resolve : {
      users : [ 'Uris', '$http', function(Uris, $http) {
        // Gets all users in the system and their roles
        return $http.get(Uris.WS_ROOT + 'accounts/all').then(function(response) {
          return response.data;
        });
      } ],
      firmhstlog : [ '$stateParams', 'Uris', '$http', 'users', function($stateParams, Uris, $http, users) {
        /* globals $:false */
        var payload = {
          oid : $stateParams.firmId
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
            if (angular.isDefined(d.document.summary)) {
              d.document.Summary = d.document.summary;
              delete d.document.summary;
            }
            if (angular.isDefined(d.document.start)) {
              d.document['Start Year'] = d.document.start;
              delete d.document.start;
            }
            if (angular.isDefined(d.document.end)) {
              d.document['End Year'] = d.document.end;
              delete d.document.end;
            }
            if (angular.isDefined(d.document.precededby)) {
              d.document['Preceded By'] = d.document.precededby;
              delete d.document.precededby;
            }
            if (angular.isDefined(d.document.succeededby)) {
              d.document['Succeeded By'] = d.document.succeededby;
              delete d.document.succeededby;
            }
            if (angular.isDefined(d.document.australian)) {
              d.document['Australian Firm'] = d.document.australian;
              delete d.document.australian;
            }
          });
          return response.data;
        }, function(response) {
          console.log('error message: ' + response.data.msg);
        });
      } ]
    },
    controller : [ '$scope', 'firmhstlog', 'ObjectDiff', function($scope, firmhstlog, ObjectDiff) {
      $scope.firmHistoryLog = firmhstlog;
      for (var i = 0; i < $scope.firmHistoryLog.length; i++) {
        var prev = i;
        var curr = i;
        if (i > 0) {
          prev = i - 1;
        }
        ObjectDiff.setOpenChar('');
        ObjectDiff.setCloseChar('');
        var diff = ObjectDiff.diffOwnProperties($scope.firmHistoryLog[prev].document, $scope.firmHistoryLog[curr].document);
        $scope.firmHistoryLog[i].diffValue = ObjectDiff.toJsonView(diff);
        $scope.firmHistoryLog[i].diffValueChanges = ObjectDiff.toJsonDiffView(diff);
      }
    } ]
  });
});