'use strict';

angular.module('qldarchApp').controller(
    'RegisterCtrl',
    function($scope, $http, Uris, toaster) {
      $scope.user = {};

      $scope.createUser = function(user) {
        if (user.hasOwnProperty('displayname') && user.hasOwnProperty('email') && user.hasOwnProperty('password') &&
            user.hasOwnProperty('confirmPassword')) {
          var dn = user.displayname;
          var em = user.email;
          var pa = user.password;
          var cp = user.confirmPassword;
          if (!((!dn || !dn.length || !/\S/.test(dn)) || (!em || !em.length || !/\S/.test(em)) || (!pa || !pa.length || !/\S/.test(pa)) || (!cp ||
              !cp.length || !/\S/.test(cp)))) {
            if (user.password === user.confirmPassword) {
              $http.post(Uris.WS_ROOT + 'signup', jQuery.param(user), {
                headers : {
                  'Content-Type' : 'application/x-www-form-urlencoded'
                }
              }).then(function(response) {
                console.log('response', response);
                if (response.data) {
                  $scope.hasResponse = true;
                  if (response.data.success) {
                    $scope.hasRegistered = true;
                  } else {
                    $scope.hasRegistered = false;
                    $scope.failedReason = response.data.reason;
                  }
                }
              });
              $scope.user = {};
            } else {
              toaster.pop('error', 'Error occured.', 'Sorry, your Confirm Password is not matched.');
            }
          } else {
            toaster.pop('error', 'Error occured.', 'Sorry, the form must not be blank or empty.');
          }
        } else {
          toaster.pop('error', 'Error occured.', 'Sorry, you must completely fill out the form.');
        }
      };
    });