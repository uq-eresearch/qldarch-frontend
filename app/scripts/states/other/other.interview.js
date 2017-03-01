'use strict';

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
angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('other.interview', {
    url : '/interview/:interviewId?time',
    templateUrl : 'views/other/interview.html',
    controller : 'InterviewCtrl',
    resolve : {
      relationships : [ 'other', function(other) {
        return angular.copy(other.relationships);
      } ],
      interview : [ '$http', '$stateParams', 'Uris', 'Relationshiplabels', function($http, $stateParams, Uris, Relationshiplabels) {
        return $http.get(Uris.WS_ROOT + 'archobj/' + $stateParams.interviewId).then(function(result) {
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
      } ]
    }
  });
});