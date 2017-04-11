'use strict';

angular.module('qldarchApp').controller('OtherCtrl', function($scope, $state, other, interviews, ArchObj) {
  $scope.other = other;
  $scope.interviews = interviews;

  var othertypes = [ {
    id : 'award',
    text : 'Award'
  }, {
    id : 'education',
    text : 'Educational Institution'
  }, {
    id : 'event',
    text : 'Event'
  }, {
    id : 'government',
    text : 'Government Institution'
  }, {
    id : 'organisation',
    text : 'Organisation'
  }, {
    id : 'person',
    text : 'Person'
  }, {
    id : 'place',
    text : 'Place'
  }, {
    id : 'publication',
    text : 'Publication'
  }, {
    id : 'topic',
    text : 'Topic'
  } ];

  $scope.other.$type = null;
  angular.forEach(othertypes, function(othertype) {
    if (other.type === othertype.id) {
      $scope.other.$type = {
        id : othertype.id,
        text : othertype.text
      };
    }
  });

  $scope.typeSelect = {
    placeholder : 'Select a Type',
    dropdownAutoWidth : true,
    multiple : false,
    data : othertypes
  };

  $scope.delete = function(other) {
    var r = window.confirm('Delete other ' + other.label + '?');
    if (r === true) {
      ArchObj.delete(other.id).then(function() {
        $state.go('others');
      });
    }
  };

  $scope.updateOther = function(data) {
    if (data.id) {
      ArchObj.updateOther(data).then(function() {
        $state.go('other.summary', {
          otherId : data.id
        });
      }).catch(function(error) {
        console.log('Failed to save', error);
        $state.go('other.summary.edit', {
          otherId : data.id
        });
      });
    } else {
      ArchObj.createOther(data).then(function() {
        $state.go('other.summary', {
          otherId : data.id
        });
      }).catch(function(error) {
        console.log('Failed to save', error);
        $state.go('other.summary.edit', {
          otherId : data.id
        });
      });
    }
  };

  $scope.cancel = function() {
    if (other.id) {
      $state.go('other.summary');
    } else {
      $state.go('others');
    }
  };
});