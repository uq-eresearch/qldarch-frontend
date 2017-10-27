'use strict';

angular.module('qldarchApp').controller(
    'RegisterCtrl',
    function($scope, vcRecaptchaService, $http, Uris, toaster) {

      $scope.recaptchaResponse = null;

      $scope.recaptchaWidgetId = null;

      $scope.recaptchaModel = {
        key : '6Lc7wQkUAAAAALbZbaaiQxLwzEuzsJdMq-fQGzt4'
      };

      $scope.setRecaptchaResponse = function(response) {
        $scope.recaptchaResponse = response;
        console.log('Response available: %s', response);
        if ($scope.recaptchaResponse) {
          toaster.pop('success', 'Success', 'You have successfully validate reCAPTCHA. Next step is to complete and/or submit the form.');
        }
      };

      $scope.setRecaptchaWidgetId = function(widgetId) {
        $scope.recaptchaWidgetId = widgetId;
        console.log('Created widget ID: %s', widgetId);
      };

      $scope.recaptchaCbExpiration = function() {
        vcRecaptchaService.reload($scope.widgetId);
        $scope.recaptchaResponse = null;
        toaster.pop('warning', 'Warning', 'reCAPTCHA has expired.');
        console.log('Captcha expired. Resetting response object');
      };

      $scope.user = {};

      $scope.createUser = function(user) {
        if ($scope.recaptchaResponse && user.hasOwnProperty('displayname') && user.hasOwnProperty('email') && user.hasOwnProperty('password') &&
            user.hasOwnProperty('confirmPassword')) {
          var dn = user.displayname;
          var em = user.email;
          var pa = user.password;
          var cp = user.confirmPassword;
          if (!((!dn || !dn.length || !/\S/.test(dn)) || (!em || !em.length || !/\S/.test(em)) || (!pa || !pa.length || !/\S/.test(pa)) || (!cp ||
              !cp.length || !/\S/.test(cp)))) {
            if (user.password === user.confirmPassword) {
              $http.post(Uris.WS_ROOT + 'signup', jQuery.param(user) + '&g-recaptcha-response=' + $scope.recaptchaResponse, {
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