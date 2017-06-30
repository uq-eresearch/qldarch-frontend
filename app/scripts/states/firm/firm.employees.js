'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('firm.employees', {
    url : '/employees',
    templateUrl : 'views/firm/employees.html',
    resolve : {
      employees : [ 'firm', '$filter', 'architects', function(firm, $filter, architects) {
        /* globals _:false */
        var employedby = $filter('filter')(firm.relationships, function(relationship) {
          if (relationship.relationship === 'employed by' && (relationship.subjecttype === 'person' || relationship.objecttype === 'person')) {
            if (relationship.subjecttype === 'person') {
              relationship.personlabel = relationship.subjectlabel;
            }
            if (relationship.objecttype === 'person') {
              relationship.personlabel = relationship.objectlabel;
            }
            return relationship;
          }
        });
        angular.forEach(employedby, function(employee) {
          angular.forEach(architects, function(architect) {
            if (employee.subjecttype === 'person') {
              employee.personId = employee.subject;
            } else {
              employee.personId = employee.object;
            }
            if (employee.personId === architect.id) {
              if (angular.isDefined(architect.media)) {
                employee.media = architect.media;
              }
            }
          });
        });
        employedby = $filter('orderBy')(employedby, function(employee) {
          return (employee.personlabel || '');
        });
        return _.uniqBy(employedby, 'personId');
      } ]
    },
    controller : [ '$scope', 'firm', 'employees', 'LayoutHelper', function($scope, firm, employees, LayoutHelper) {
      $scope.firm = firm;
      $scope.employeeRows = LayoutHelper.group(employees, 6);
    } ]
  });
});