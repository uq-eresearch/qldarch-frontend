'use strict';

angular.module('qldarchApp').controller('AdminChangesLogCtrl', function($scope, $http, Uris, YYYYMMDDdate, users) {
  /* globals $:false */
  $scope.chgslog = {};
  $scope.chgslog.startDate = new Date();
  $scope.chgslog.startDate.setDate($scope.chgslog.startDate.getDate() - 7);
  $scope.chgslog.endDate = new Date();

  $scope.chgslog.dateOptions = {
    formatYear : 'yy',
    startingDay : 1
  };

  $scope.chgslog.status = {
    openedStartDate : false,
    openedEndDate : false,
    disabledRetrieve : false
  };

  $scope.chgslog.openStartDate = function() {
    $scope.chgslog.status.openedStartDate = true;
  };

  $scope.chgslog.openEndDate = function() {
    $scope.chgslog.status.openedEndDate = true;
  };

  $scope.chgslog.getChangesLog = function() {
    var payload = {};
    payload.startdate = YYYYMMDDdate.formatDate($scope.chgslog.startDate);
    payload.enddate = YYYYMMDDdate.formatDate($scope.chgslog.endDate);
    $http({
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
      $scope.chgslog.changesLog = response.data;
    }, function(response) {
      console.log('error message: ' + response.data.msg);
    });
  };

  $scope.$watchCollection('[chgslog.startDate, chgslog.endDate]', function(dates) {
    if (!(dates[0] instanceof Date) || !(dates[1] instanceof Date)) {
      $scope.chgslog.status.disabledRetrieve = true;
    } else {
      $scope.chgslog.status.disabledRetrieve = false;
    }
  });

  $scope.chgslog.getChangesLog();

});