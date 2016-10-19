'use strict';

angular.module('angularApp')
  .controller('ContributeCtrl', function ($scope, $http, Uris, $state, toaster) {
    $scope.postMsg = function (msg) {
        $http.post(Uris.JSON_ROOT + 'contact/message', jQuery.param(msg), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (response) {
            console.log('response', response);
            $state.go('main');
            if(response.data.success) {
              toaster.pop('success', 'Message Sent', 'You have successfully sent your message.');
            } else {
              toaster.pop('error', 'Error occured.', 'Sorry, we couldn\t send your message at this time.');
            }
        });
    };
  });
