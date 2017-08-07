'use strict';

angular.module('qldarchApp').controller('AdminMoveRelationshipsCtrl', function($scope, $http, Uris, $state, toaster, $filter, all) {
  /* globals $:false */
  $scope.move = function(from, to) {
    $http({
      method : 'POST',
      url : Uris.WS_ROOT + 'relationships/move',
      headers : {
        'Content-Type' : 'application/x-www-form-urlencoded'
      },
      withCredentials : true,
      transformRequest : function(obj) {
        return $.param(obj, true);
      },
      data : {
        from : from.id,
        to : to.id
      }
    }).then(function() {
      $state.go('main');
      toaster.pop('success', 'Relationships moved', 'You have moved relationships');
    }, function() {
      toaster.pop('error', 'Error occured', 'Sorry, we couldn\t move relationships');
    });
  };

  all = $filter('orderBy')(all, function(entity) {
    return entity.label;
  });

  var allSelect = {
    results : []
  };

  angular.forEach(all, function(e) {
    if (e.label && !(/\s/.test(e.label.substring(0, 1)))) {
      var entitytype = 'unknown';
      if (e.hasOwnProperty('type')) {
        entitytype = e.type.charAt(0).toUpperCase() + e.type.slice(1);
      } else if (e.hasOwnProperty('firstname') || e.hasOwnProperty('lastname')) {
        entitytype = 'Person';
      } else if (e.hasOwnProperty('lat') || e.hasOwnProperty('lng')) {
        entitytype = 'Structure';
      }
      allSelect.results.push({
        id : e.id,
        text : e.label + ' (' + entitytype + ')'
      });
    }
  });

  $scope.entitySelect = {
    placeholder : 'Architect, Project, Firm or Other',
    dropdownAutoWidth : true,
    multiple : false,
    data : allSelect
  };

});