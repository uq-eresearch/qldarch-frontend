'use strict';

angular.module('qldarchApp').config(function($urlRouterProvider, $httpProvider, $qProvider, $locationProvider) {

  console.log('does this work?');

  $locationProvider.hashPrefix('');
  $locationProvider.html5Mode(true);

  $qProvider.errorOnUnhandledRejections(false);

  $httpProvider.defaults.withCredentials = true;

  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise('/');

  $httpProvider.interceptors.push([ '$q', 'toaster', function($q, toaster) {
    return {
      responseError : function(rejection) {
        // do something on error
        console.log('got a Response ERROR!', rejection);
        toaster.pop('warning', rejection.statusText, rejection.data.msg);
        return $q.reject(rejection);
      }
    };
  } ]);
});