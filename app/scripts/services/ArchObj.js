'use strict';

angular.module('qldarchApp').factory('ArchObj', function($http, $cacheFactory, Uris, RelationshipLabels, toaster) {
  /* globals $:false */
  var path = Uris.WS_ROOT + 'archobj/';

  function getStartTime(exchange) {
    if (!exchange.time) {
      return 0;
    }
    return exchange.time;
  }

  function isLastExchange(exchange, exchanges) {
    return exchanges.indexOf(exchange) === exchanges.length - 1;
  }

  function nextExchange(exchange, exchanges) {
    var nextIndex = exchanges.indexOf(exchange) + 1;
    if (nextIndex >= exchanges.length) {
      throw new Error('Can\'t find next exchange');
    }
    return exchanges[nextIndex];
  }

  function getEndTime(exchange, exchanges) {
    if (isLastExchange(exchange, exchanges)) {
      exchange.endTime = 999999;
      return exchange.endTime;
    }
    return nextExchange(exchange, exchanges).time;
  }

  // Public API here
  var archobj = {
    clearAll : function() {
      $cacheFactory.get('$http').removeAll();
    },

    createArchitect : function(data) {
      var payload = angular.copy(data);
      payload.label = payload.firstname + ' ' + payload.lastname;
      payload.architect = true;
      // Remove any extra information
      delete payload.associatedMedia;
      delete payload.created;
      delete payload.id;
      delete payload.interviews;
      delete payload.media;
      delete payload.owner;
      delete payload.relationships;
      delete payload.version;
      // delete payload.type;
      // delete payload.label;
      // delete payload.summary;
      // delete payload.firstname;
      // delete payload.lastname;
      // delete payload.preflabel;
      // delete payload.practicedinqueensland;
      // delete payload.architect;
      return $http({
        method : 'PUT',
        url : path,
        headers : {
          'Content-Type' : 'application/x-www-form-urlencoded'
        },
        withCredentials : true,
        transformRequest : function(obj) {
          return $.param(obj);
        },
        data : payload
      }).then(function(response) {
        angular.extend(data, response.data);
        toaster.pop('success', data.label + ' created.');
        console.log('created architect id:' + data.id);
        return data;
      }, function() {
        toaster.pop('error', 'Error occured.', 'Sorry, we save at this time');
      });
    },

    updateArchitect : function(data) {
      var payload = angular.copy(data);
      // Remove any extra information
      delete payload.architect;
      delete payload.associatedMedia;
      delete payload.created;
      delete payload.id;
      delete payload.interviews;
      delete payload.label;
      delete payload.media;
      delete payload.owner;
      delete payload.relationships;
      delete payload.version;
      // delete payload.type;
      // delete payload.firstname;
      // delete payload.lastname;
      // delete payload.preflabel;
      // delete payload.practicedinqueensland;
      // delete payload.summary;
      return $http({
        method : 'POST',
        url : path + data.id,
        headers : {
          'Content-Type' : 'application/x-www-form-urlencoded'
        },
        withCredentials : true,
        transformRequest : function(obj) {
          return $.param(obj);
        },
        data : payload
      }).then(function(response) {
        angular.extend(data, response.data);
        toaster.pop('success', data.label + ' updated.');
        console.log('updated architect id:' + data.id);
        return data;
      }, function() {
        toaster.pop('error', 'Error occured.', 'Sorry, we save at this time');
      });
    },

    createFirm : function(data) {
      var payload = angular.copy(data);
      if (!(payload.start instanceof Date)) {
        payload.start = new Date(payload.start);
      }
      var startdate =  '0' + payload.start.getDate();
      var startmonth = '0' + (payload.start.getMonth() + 1);
      var startyear =  payload.start.getFullYear();
      if (!(isNaN(startdate)||isNaN(startmonth)||isNaN(startyear))) {
        var fixedStartDate = startyear + '-' + startmonth + '-' + startdate ;
        payload.start = fixedStartDate;
      } else {
        delete payload.start;
      }
      if (!(payload.end instanceof Date)) {
        payload.end = new Date(payload.end);
      }
      var enddate =  '0' + payload.end.getDate();
      var endmonth = '0' + (payload.end.getMonth() + 1);
      var endyear =  payload.end.getFullYear();
      if (!(isNaN(enddate)||isNaN(endmonth)||isNaN(endyear))) {
        var fixedEndDate = endyear + '-' + endmonth + '-' + enddate ;
        payload.end = fixedEndDate;
      } else {
        delete payload.end;
      }
      if (payload.$precededByFirms !== null && angular.isDefined(payload.$precededByFirms)) {
        payload.precededby = payload.$precededByFirms.id;
      }
      if (payload.$succeededByFirms !== null && angular.isDefined(payload.$succeededByFirms)) {
        payload.succeededby = payload.$succeededByFirms.id;
      }
      // Remove any extra information
      delete payload.$precededByFirms;
      delete payload.$succeededByFirms;
      delete payload.locked;
      delete payload.associatedMedia;
      delete payload.created;
      delete payload.id;
      delete payload.interviews;
      delete payload.media;
      delete payload.owner;
      delete payload.relationships;
      delete payload.version;
      // delete payload.type;
      // delete payload.label;
      // delete payload.summary;
      // delete payload.australian;
      // delete payload.start;
      // delete payload.end;
      // delete payload.precededby;
      // delete payload.succeededby;
      return $http({
        method : 'PUT',
        url : path,
        headers : {
          'Content-Type' : 'application/x-www-form-urlencoded'
        },
        withCredentials : true,
        transformRequest : function(obj) {
          return $.param(obj);
        },
        data : payload
      }).then(function(response) {
        angular.extend(data, response.data);
        toaster.pop('success', data.label + ' created.');
        console.log('created firm id:' + data.id);
        return data;
      }, function() {
        toaster.pop('error', 'Error occured.', 'Sorry, we save at this time');
      });
    },

    updateFirm : function(data) {
      var payload = angular.copy(data);
      if (!(payload.start instanceof Date)) {
        payload.start = new Date(payload.start);
      }
      var startdate =  '0' + payload.start.getDate();
      var startmonth = '0' + (payload.start.getMonth() + 1);
      var startyear =  payload.start.getFullYear();
      if (!(isNaN(startdate)||isNaN(startmonth)||isNaN(startyear))) {
        var fixedStartDate = startyear + '-' + startmonth + '-' + startdate ;
        payload.start = fixedStartDate;
      } else {
        delete payload.start;
      }
      if (!(payload.end instanceof Date)) {
        payload.end = new Date(payload.end);
      }
      var enddate =  '0' + payload.end.getDate();
      var endmonth = '0' + (payload.end.getMonth() + 1);
      var endyear =  payload.end.getFullYear();
      if (!(isNaN(enddate)||isNaN(endmonth)||isNaN(endyear))) {
        var fixedEndDate = endyear + '-' + endmonth + '-' + enddate ;
        payload.end = fixedEndDate;
      } else {
        delete payload.end;
      }
      if (payload.$precededByFirms !== null && angular.isDefined(payload.$precededByFirms)) {
        payload.precededby = payload.$precededByFirms.id;
      }
      if (payload.$succeededByFirms !== null && angular.isDefined(payload.$succeededByFirms)) {
        payload.succeededby = payload.$succeededByFirms.id;
      }
      // Remove any extra information
      delete payload.$precededByFirms;
      delete payload.$succeededByFirms;
      delete payload.locked;
      delete payload.associatedMedia;
      delete payload.created;
      delete payload.id;
      delete payload.interviews;
      delete payload.media;
      delete payload.owner;
      delete payload.relationships;
      delete payload.version;
      // delete payload.type;
      // delete payload.label;
      // delete payload.australian;
      // delete payload.summary;
      // delete payload.start;
      // delete payload.end;
      // delete payload.precededby;
      // delete payload.succeededby;
      return $http({
        method : 'POST',
        url : path + data.id,
        headers : {
          'Content-Type' : 'application/x-www-form-urlencoded'
        },
        withCredentials : true,
        transformRequest : function(obj) {
          return $.param(obj);
        },
        data : payload
      }).then(function(response) {
        angular.extend(data, response.data);
        toaster.pop('success', data.label + ' updated.');
        console.log('updated firm id:' + data.id);
        return data;
      }, function() {
        toaster.pop('error', 'Error occured.', 'Sorry, we save at this time');
      });
    },

    createStructure : function(data) {
      var payload = angular.copy(data);
      if (!(payload.completion instanceof Date)) {
        payload.completion = new Date(payload.completion);
      }
      var date =  '0' + payload.completion.getDate();
      var month = '0' + (payload.completion.getMonth() + 1);
      var year =  payload.completion.getFullYear();
      if (!(isNaN(date)||isNaN(month)||isNaN(year))) {
        var fixedDate = year + '-' + month + '-' + date ;
        payload.completion = fixedDate;
      } else {
        delete payload.completion;
      }
      // Remove any extra information
      delete payload.$associatedFirm;
      delete payload.$associatedArchitects;
      delete payload.$typologies;
      delete payload.lat;
      delete payload.lon;
      delete payload.locked;
      delete payload.associatedMedia;
      delete payload.created;
      delete payload.id;
      delete payload.interviews;
      delete payload.media;
      delete payload.owner;   
      delete payload.relationships;
      delete payload.version;
      delete payload.typologies;
      // delete payload.type;
      // delete payload.label;
      // delete payload.summary;
      // delete payload.location;
      // delete payload.completion;
      // delete payload.latitude;
      // delete payload.longitude;
      // delete payload.australian;
      // delete payload.demolished;
      return $http({
        method : 'PUT',
        url : path,
        headers : {
          'Content-Type' : 'application/x-www-form-urlencoded'
        },
        withCredentials : true,
        transformRequest : function(obj) {
          return $.param(obj);
        },
        data : payload
      }).then(function(response) {
        angular.extend(data, response.data);
        toaster.pop('success', data.label + ' updated.');
        console.log('updated firm id:' + data.id);
        return data;
      }, function() {
        toaster.pop('error', 'Error occured.', 'Sorry, we save at this time');
      });
    },

    updateStructure : function(data) {
      var payload = angular.copy(data);
      if (!(payload.completion instanceof Date)) {
        payload.completion = new Date(payload.completion);
      }
      var date =  '0' + payload.completion.getDate();
      var month = '0' + (payload.completion.getMonth() + 1);
      var year =  payload.completion.getFullYear();
      if (!(isNaN(date)||isNaN(month)||isNaN(year))) {
        var fixedDate = year + '-' + month + '-' + date ;
        payload.completion = fixedDate;
      } else {
        delete payload.completion;
      }
      // Remove any extra information
      delete payload.$associatedFirm;
      delete payload.$associatedArchitects;
      delete payload.$typologies;
      delete payload.lat;
      delete payload.lon;
      delete payload.locked;
      delete payload.associatedMedia;
      delete payload.created;
      delete payload.id;
      delete payload.interviews;
      delete payload.media;
      delete payload.owner;
      delete payload.relationships;
      delete payload.version;
      // delete payload.type;
      // delete payload.label;
      // delete payload.australian;
      // delete payload.summary;
      // delete payload.location;
      // delete payload.completion;
      // delete payload.latitude;
      // delete payload.longitude;
      // delete payload.demolished;
      // delete payload.typologies;
      return $http({
        method : 'POST',
        url : path + data.id,
        headers : {
          'Content-Type' : 'application/x-www-form-urlencoded'
        },
        withCredentials : true,
        transformRequest : function(obj) {
          return $.param(obj);
        },
        data : payload
      }).then(function(response) {
        angular.extend(data, response.data);
        toaster.pop('success', data.label + ' updated.');
        console.log('updated firm id:' + data.id);
        return data;
      }, function() {
        toaster.pop('error', 'Error occured.', 'Sorry, we save at this time');
      });
    },

    delete: function (id) {
      return $http.delete(path + id, {
        withCredentials:true
      }).then(function(response) {
        toaster.pop('success', 'archobj id:' + id + ' deleted.');
        console.log('deleted archobj id:' + id);
        return response.data;
      });
    },

    load : function(id) {
      return $http.get(path + id).then(function(result) {
        console.log('load archobj id:' + id);
        return result.data;
      });
    },

    loadWithRelationshipLabels : function(id) {
      return $http.get(path + id).then(function(result) {
        console.log('loadWithRelationshipLabels archobj id:' + id);
        angular.forEach(result.data.relationships, function(relationship) {
          if (RelationshipLabels.hasOwnProperty(relationship.relationship)) {
            relationship.relationship = RelationshipLabels[relationship.relationship];
          }
        });
        return result.data;
      });
    },

    loadInterviewObj : function(interviewId) {
      return $http.get(path + interviewId).then(function(result) {
        console.log('loadInterviewObj id:' + interviewId);
        angular.forEach(result.data.transcript, function(exchange) {
          exchange.startTime = getStartTime(exchange);
          exchange.endTime = getEndTime(exchange, result.data.transcript);
          if (exchange.hasOwnProperty('relationships')) {
            angular.forEach(exchange.relationships, function(relationship) {
              if (RelationshipLabels.hasOwnProperty(relationship.relationship)) {
                relationship.relationship = RelationshipLabels[relationship.relationship];
              }
            });
          }
        });
        return result.data;
      });
    }
  };

  return archobj;
});