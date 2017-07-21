'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('interviewhistorylog', {
    url : '/interviewhistorylog?interviewId',
    templateUrl : 'views/interviewhistorylog.html',
    resolve : {
      interview : [ '$stateParams', 'ArchObj', function($stateParams, ArchObj) {
        return ArchObj.load($stateParams.interviewId).then(function(data) {
          return data;
        });
      } ],
      users : [ 'Uris', '$http', function(Uris, $http) {
        // Gets all users in the system and their roles
        return $http.get(Uris.WS_ROOT + 'accounts/all').then(function(response) {
          return response.data;
        });
      } ],
      interviewhstlog : [ '$stateParams', 'Uris', '$http', 'users', function($stateParams, Uris, $http, users) {
        /* globals $:false */
        var payload = {
          oid : $stateParams.interviewId
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
    controller : [ '$scope', 'interviewhstlog', 'ObjectDiff', 'interview', 'ArchObj', '$state', function($scope, interviewhstlog, ObjectDiff, interview, ArchObj, $state) {
      $scope.interview = interview;
      $scope.interviewHistoryLog = interviewhstlog;
      
      for (var i = 0; i < $scope.interviewHistoryLog.length; i++) {
        var prev = i;
        var curr = i;
        if (i > 0) {
          prev = i - 1;
        }
        ObjectDiff.setOpenChar('');
        ObjectDiff.setCloseChar('');
        var diff = ObjectDiff.diffOwnProperties($scope.interviewHistoryLog[prev].document, $scope.interviewHistoryLog[curr].document);
        $scope.interviewHistoryLog[i].diffValue = ObjectDiff.toJsonView(diff);
        $scope.interviewHistoryLog[i].diffValueChanges = ObjectDiff.toJsonDiffView(diff);
      }
      
      $scope.delete = function(interview) {
        var r = window.confirm('Delete interview ' + interview.label + '?');
        if (r === true) {
          ArchObj.delete(interview.id).then(function() {
            $state.go('interviews');
          });
        }
      };
    } ]
  });
});