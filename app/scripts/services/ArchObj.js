'use strict';

angular.module('qldarchApp').factory('ArchObj', function($http, $cacheFactory, Uris, Relationshiplabels) {

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

    load : function(id) {
      return $http.get(Uris.WS_ROOT + 'archobj/' + id).then(function(result) {
        console.log('load archobj id:' + id);
        return result.data;
      });
    },

    loadWithRelationshipLabels : function(id) {
      return $http.get(Uris.WS_ROOT + 'archobj/' + id).then(function(result) {
        console.log('loadWithRelationshipLabels archobj id:' + id);
        angular.forEach(result.data.relationships, function(relationship) {
          if (Relationshiplabels.hasOwnProperty(relationship.relationship)) {
            relationship.relationship = Relationshiplabels[relationship.relationship];
          }
        });
        return result.data;
      });
    },

    loadInterviewObj : function(interviewId) {
      return $http.get(Uris.WS_ROOT + 'archobj/' + interviewId).then(function(result) {
        console.log('loadInterviewObj id:' + interviewId);
        angular.forEach(result.data.transcript, function(exchange) {
          exchange.startTime = getStartTime(exchange);
          exchange.endTime = getEndTime(exchange, result.data.transcript);
          if (exchange.hasOwnProperty('relationships')) {
            angular.forEach(exchange.relationships, function(relationship) {
              if (Relationshiplabels.hasOwnProperty(relationship.relationship)) {
                relationship.relationship = Relationshiplabels[relationship.relationship];
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