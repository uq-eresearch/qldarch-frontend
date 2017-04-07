'use strict';

angular.module('qldarchApp').config(function($urlRouterProvider, $httpProvider, $qProvider, $locationProvider) {

  console.log('does this work?');

  $locationProvider.hashPrefix('');

  $qProvider.errorOnUnhandledRejections(false);

  $httpProvider.defaults.withCredentials = true;

  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise('/');

  $httpProvider.interceptors.push([ '$q', 'toaster', function($q, toaster) {
    return {
      responseError : function(rejection) {
        // do something on error
        console.log('got a Response ERROR!', rejection);
        if (rejection.status === 403) {
          toaster.pop('warning', 'You are not logged in.', 'Please log in to continue.');
        }
        if (rejection.status === 500) {
          toaster.pop('error', 'Oops. Something went wrong.', 'Please contact the system administrator.');
        }
        return $q.reject(rejection);
      }
    };
  } ]);
});