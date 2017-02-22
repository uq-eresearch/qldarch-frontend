'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('firm.employees', {
    url : '/employees',
    templateUrl : 'views/firm/employees.html',
    resolve : {
      employees : [ 'firm', '$filter', '$http', 'Uris', function(firm, $filter, $http, Uris) {
        /* globals _:false */
        var employedby = $filter('filter')(firm.relationships, function(relationship) {
          if (relationship.relationship === 'employed by') {
            return $http.get(Uris.WS_ROOT + 'archobj/' + relationship.subject).then(function(result) {
              if (angular.isUndefined(relationship.media)) {
                relationship.media = $filter('filter')(result.data.media, function(med) {
                  return (med.preferred || (med.type === 'Photograph' || 'Portrait' || 'Image'));
                }).id;
              }
              return relationship;
            });
          }
        });
        return _.uniqBy(employedby, 'subjectlabel');
      } ]
    },
    controller : [ '$scope', 'firm', 'employees', 'LayoutHelper', function($scope, firm, employees, LayoutHelper) {
      $scope.firm = firm;
      $scope.employeeRows = LayoutHelper.group(employees, 6);
    } ]
  });
});