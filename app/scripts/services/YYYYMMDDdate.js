'use strict';

angular.module('qldarchApp').service('YYYYMMDDdate', function() {
  var formatdate = {
    formatDate : function(date) {
      if (!(date instanceof Date)) {
        date = new Date(date);
      }
      var day = '' + date.getDate();
      if (day.length < 2) {
        day = '0' + day;
      }
      var month = '' + (date.getMonth() + 1);
      if (month.length < 2) {
        month = '0' + month;
      }
      var year = date.getFullYear();
      if (!(isNaN(day) || isNaN(month) || isNaN(year))) {
        date = year + '-' + month + '-' + day;
      } else {
        date = null;
      }
      return date;
    }
  };

  return formatdate;
});