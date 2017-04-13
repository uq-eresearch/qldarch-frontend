'use strict';

angular.module('qldarchApp').controller('RelationshipsCreateCtrl', function($scope, $http, Uris, toaster) {
  /* globals $:false */
  $scope.relationship = {};

  var createRelationship = function(data) {
    var payload = angular.copy(data);
    return $http({
      method : 'PUT',
      url : Uris.WS_ROOT + 'relationship',
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
      toaster.pop('success', data.id + ' relationship created.');
      console.log('created relationship id:' + data.id);
      return data;
    }, function() {
      toaster.pop('error', 'Error occured.', 'Sorry, we save at this time');
    });
  };

  $scope.createRelationship = function(relationship) {
    createRelationship(relationship);
  };
});