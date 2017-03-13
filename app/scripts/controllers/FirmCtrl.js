'use strict';

angular.module('qldarchApp').controller('FirmCtrl', function($scope, $filter, firm, firms, ArchObjTypeLabels, ArchObj, $state) {
  $scope.firm = firm;

  firms = $filter('orderBy')(firms, function(firm) {
    return firm.label;
  });

  $scope.firm.$type = null;
  for (var type in ArchObjTypeLabels) {
    if (firm.type === type) {
      $scope.firm.$type = {id: type, text: ArchObjTypeLabels[type]};
    }
  }

  $scope.typeSelect = {
      placeholder: 'Select a Type',
      dropdownAutoWidth: true,
      multiple: false,
      query: function (options) {
        var data = {
            results: []
        };
        for (var type in ArchObjTypeLabels) {
          data.results.push({
            id: type,
            text: ArchObjTypeLabels[type]
          });
        }
        options.callback(data);
      }
  };

  $scope.updateFirm = function (data) {
    if (data.id) {
      ArchObj.updateFirm(data).then(function() {
        $state.go('firm.summary', {
          firmId: data.id
        });
      }).catch(function (error) {
        console.log('Failed to save', error);
        $state.go('firm.summary.edit', {
          firmId: data.id
        });
      });
    } else {
      console.log('firm', data);
    }
  };

  if(angular.isDefined(firm.precededby)) {
    $scope.firm.$precededByFirms = {id: firm.precededby.id, text: firm.precededby.label};
  } else {
    $scope.firm.$precededByFirms = null;
  }

  $scope.precededBySelect = {
      placeholder: 'Select a Firm',
      dropdownAutoWidth: true,
      multiple: false,
      query: function(options) {
        var data = {
            results: []
        };
        angular.forEach(firms, function(precededby) {
          data.results.push({
            id: precededby.id,
            text: precededby.label
          });
        });
        options.callback(data);
      }
  };

  if(angular.isDefined(firm.succeededby)) {
    $scope.firm.$succeededByFirms = {id: firm.succeededby.id, text: firm.succeededby.label};
  } else {
    $scope.firm.$succeededByFirms = null;
  }

  $scope.succeededBySelect = {
      placeholder: 'Select a Firm',
      dropdownAutoWidth: true,
      multiple: false,
      query: function(options) {
        var data = {
            results: []
        };
        angular.forEach(firms, function(succeededby) {
          data.results.push({
            id: succeededby.id,
            text: succeededby.label
          });
        });
        options.callback(data);
      }
  };

  $scope.cancel = function () {
    if (firm.id) {
      $state.go('firm.summary');
    } else {
      $state.go('firms.australian');
    }
  };
});