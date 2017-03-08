'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('firm.employees', {
    url : '/employees',
    templateUrl : 'views/firm/employees.html',
    resolve : {
      employees : [ 'firm', '$filter', 'ArchObj', function(firm, $filter, ArchObj) {
        /* globals _:false */
        var employedby = $filter('filter')(firm.relationships, function(relationship) {
          if (relationship.relationship === 'employed by') {        
            return ArchObj.load(relationship.subject).then(function(data) {
              if (angular.isUndefined(relationship.media)) {
                relationship.media = $filter('filter')(data.media, function(med) {
                  return (med.preferred || (med.type === 'Photograph' || 'Portrait' || 'Image'));
                }).id;
              }
              return relationship;
            }).catch(function() {
              console.log('unable to load relationship subject ArchObj');
              return {};
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