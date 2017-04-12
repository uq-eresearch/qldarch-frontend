'use strict';

angular.module('qldarchApp').controller(
    'ContributeCtrl',
    function($scope, ENV, vcRecaptchaService, $http, Uris, $state, toaster) {

      $scope.recaptchaResponse = null;

      $scope.recaptchaWidgetId = null;

      $scope.recaptchaModel = {
        key : '6Lc7wQkUAAAAALbZbaaiQxLwzEuzsJdMq-fQGzt4'// qldarch.net@gmail.com
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

      $scope.postMsg = function(msg) {
        /**
         * To implement server side validation Send the reCaptcha response to
         * the server (backend) And use some of the server side APIs to validate
         * it See https://developers.google.com/recaptcha/docs/verify
         */
        if ($scope.recaptchaResponse && msg) {
          if (msg.hasOwnProperty('content') && msg.hasOwnProperty('firstname') && msg.hasOwnProperty('lastname') && msg.hasOwnProperty('from')) {
            var c = msg.content;
            var fn = msg.firstname;
            var ln = msg.lastname;
            var f = msg.from;
            if (!((!c || !c.length || !/\S/.test(c)) || (!fn || !fn.length || !/\S/.test(fn)) || (!ln || !ln.length || !/\S/.test(ln)) || (!f ||
                !f.length || !/\S/.test(f)))) {
              console.log('msg', msg);
              $http.post(Uris.WS_ROOT + 'message/contact', jQuery.param(msg) + '&g-recaptcha-response=' + $scope.recaptchaResponse, {
                headers : {
                  'Content-Type' : 'application/x-www-form-urlencoded'
                }
              }).then(function(response) {
                console.log('response', response);
                $state.go('main');
                if (response.data.success) {
                  toaster.pop('success', 'Message Sent', 'You have successfully sent your message.');
                } else {
                  toaster.pop('error', 'Error occured.', 'Sorry, we couldn\t send your message at this time.');
                }
              });
            } else {
              toaster.pop('error', 'Error occured.', 'Sorry, the form must not be blank or empty.');
            }
          } else {
            toaster.pop('error', 'Error occured.', 'Sorry, you must completely fill out the form.');
          }
        } else if (!msg) {
          if (!$scope.recaptchaResponse) {
            toaster.pop('error', 'Error occured.', 'Sorry, you must fill out the form and validate reCAPTCHA.');
          } else {
            toaster.pop('error', 'Error occured.', 'Sorry, you must fill out the form.');
          }
        } else if (!msg.hasOwnProperty('content') || !msg.hasOwnProperty('firstname') || !msg.hasOwnProperty('lastname') ||
            !msg.hasOwnProperty('from')) {
          toaster.pop('error', 'Error occured.', 'Sorry, you must completely fill out the form and validate reCAPTCHA.');
        } else if (((!msg.content || !msg.content.length || !/\S/.test(msg.content)) ||
            (!msg.firstname || !msg.firstname.length || !/\S/.test(msg.firstname)) ||
            (!msg.lastname || !msg.lastname.length || !/\S/.test(msg.lastname)) || (!msg.from || !msg.from.length || !/\S/.test(msg.from)))) {
          toaster.pop('error', 'Error occured.', 'Sorry, the form and reCAPTCHA must not be blank or empty.');
        } else {
          toaster.pop('error', 'Failed validation.', 'Sorry, you must fill and validate reCAPTCHA');
          vcRecaptchaService.reload($scope.recaptchaWidgetId);
        }
      };
    });
