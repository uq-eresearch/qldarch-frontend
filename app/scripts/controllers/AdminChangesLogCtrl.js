'use strict';

angular.module('qldarchApp').controller('AdminChangesLogCtrl', function($scope, $http, Uris, users) {
  /* globals $:false */
  $scope.chgslog = {};
  $scope.chgslog.startDate = new Date();
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
    payload.startdate = $scope.chgslog.startDate;
    if (!(payload.startdate instanceof Date)) {
      payload.startdate = new Date(payload.startdate);
    }
    var datestart = '0' + payload.startdate.getDate();
    var monthstart = '0' + (payload.startdate.getMonth() + 1);
    var yearstart = payload.startdate.getFullYear();
    if (!(isNaN(datestart) || isNaN(monthstart) || isNaN(yearstart))) {
      var fixedStartDate = yearstart + '-' + monthstart + '-' + datestart;
      payload.startdate = fixedStartDate;
    }
    payload.enddate = $scope.chgslog.endDate;
    if (!(payload.enddate instanceof Date)) {
      payload.enddate = new Date(payload.enddate);
    }
    var dateend = '0' + payload.enddate.getDate();
    var monthend = '0' + (payload.enddate.getMonth() + 1);
    var yearend = payload.enddate.getFullYear();
    if (!(isNaN(dateend) || isNaN(monthend) || isNaN(yearend))) {
      var fixedEndDate = yearend + '-' + monthend + '-' + dateend;
      payload.enddate = fixedEndDate;
    }
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
    });
  };

  $scope.$watchCollection('[chgslog.startDate, chgslog.endDate]', function(dates) {
    if (!(dates[0] instanceof Date) || !(dates[1] instanceof Date)) {
      $scope.chgslog.status.disabledRetrieve = true;
    } else {
      $scope.chgslog.status.disabledRetrieve = false;
    }
  });

});