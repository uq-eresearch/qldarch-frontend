'use strict';

angular.module('qldarchApp').config(
    function($stateProvider) {
      $stateProvider.state('firm.employees', {
        url : '/employees',
        templateUrl : 'views/firm/employees.html',
        resolve : {
          employees : [ '$stateParams', 'GraphHelper', 'Uris', 'Architect', 'Relationship',
              function($stateParams, GraphHelper, Uris, Architect, Relationship) {
                var firmUri = GraphHelper.decodeUriString($stateParams.firmId);

                return Relationship.findBySubjectPredicateObject({
                  predicate : 'qldarch:employedBy',
                  object : firmUri
                }).then(function(relationships) {
                  // Get all the architects
                  var architectUris = GraphHelper.getAttributeValuesUnique(relationships, Uris.QA_SUBJECT);
                  return Architect.loadList(architectUris, true).then(function(architects) {
                    return GraphHelper.graphValues(architects);
                  });
                });
              } ]
        },
        controller : [ '$scope', 'firm', 'employees', 'LayoutHelper', function($scope, firm, employees, LayoutHelper) {
          $scope.firm = firm;
          $scope.employeeRows = LayoutHelper.group(employees, 6);
        } ]
      });
    });