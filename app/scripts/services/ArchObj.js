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

      updateArchitect: function (data) {
        var payload = angular.copy(data);
        if (payload.$type.id !== null && angular.isDefined(payload.$type.id)) {
          payload.type = payload.$type.id;
        }
        // Remove any extra information
        delete payload.$type;
        delete payload.architect;
        delete payload.associatedMedia;
        delete payload.created;
        // delete payload.firstname;
        delete payload.id;
        delete payload.interviews;
        delete payload.label;
        // delete payload.lastname;
        // delete payload.preflabel;
        delete payload.media;
        delete payload.owner;
        // delete payload.practicedinqueensland;
        delete payload.relationships;
        delete payload.version;
        // delete payload.summary;
        // delete payload.type;
        return $http({
          method: 'POST',
          url: path + data.id,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: true,
          transformRequest: function(obj) {
            return $.param(obj);
          },
          data: payload
        }).then(function (response) {
          angular.extend(data, response.data);
          toaster.pop('success', data.label + ' updated.');
          console.log('updated architect id:' + data.id);
          return data;
        }, function () {
          toaster.pop('error', 'Error occured.', 'Sorry, we save at this time');
        });
      },

      updateFirm: function (data) {
        var payload = angular.copy(data);
        if (payload.$type.id !== null && angular.isDefined(payload.$type.id)) {
          payload.type = payload.$type.id;
        }
        if (payload.$precededByFirms !== null && angular.isDefined(payload.$precededByFirms)) {
          payload.precededby = payload.$precededByFirms.id;
        }
        if (payload.$succeededByFirms !== null && angular.isDefined(payload.$succeededByFirms)) {
          payload.succeededby = payload.$succeededByFirms.id;
        }
        // Remove any extra information
        delete payload.$type;
        delete payload.$precededByFirms;
        delete payload.$succeededByFirms;
        delete payload.locked;
        delete payload.associatedMedia;
        delete payload.created;
        delete payload.id;
        delete payload.interviews;
        // delete payload.label;
        delete payload.media;
        delete payload.owner;
        // delete payload.australian;
        delete payload.relationships;
        delete payload.version;
        // delete payload.summary;
        // delete payload.type;
        // delete payload.start;
        // delete payload.end;
        // delete payload.precededby;
        // delete payload.succeededby;
        return $http({
          method: 'POST',
          url: path + data.id,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: true,
          transformRequest: function(obj) {
            return $.param(obj);
          },
          data: payload
        }).then(function (response) {
          angular.extend(data, response.data);
          toaster.pop('success', data.label + ' updated.');
          console.log('updated firm id:' + data.id);
          return data;
        }, function () {
          toaster.pop('error', 'Error occured.', 'Sorry, we save at this time');
        });
      },

      delete: function (id) {
        return $http.delete(path + id, {withCredentials: true}).then(function(response) {
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