'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('architect.employers', {
    url : '/employers',
    templateUrl : 'views/architect/employers.html',
    resolve : {
      employers : [ 'architect', '$filter', 'firms', function(architect, $filter, firms) {
        /* globals _:false */
        var employedby = $filter('filter')(architect.relationships, function(relationship) {
          if (relationship.relationship === 'employed by' && (relationship.subjecttype === 'firm' || relationship.objecttype === 'firm')) {
            if (relationship.subjecttype === 'firm') {
              relationship.firmlabel = relationship.subjectlabel;
            }
            if (relationship.objecttype === 'firm') {
              relationship.firmlabel = relationship.objectlabel;
            }
            return relationship;
          }
        });
        angular.forEach(employedby, function(employer) {
          angular.forEach(firms, function(firm) {
            if (employer.subjecttype === 'firm') {
              employer.firmId = employer.subject;
            } else {
              employer.firmId = employer.object;
            }
            if (employer.firmId === firm.id) {
              if (angular.isDefined(firm.media)) {
                employer.media = firm.media;
              }
            }
          });
        });
        employedby = $filter('orderBy')(employedby, function(employer) {
          return (employer.firmlabel || '');
        });
        return _.uniqBy(employedby, 'firmId');
      } ]
    },
    controller : [ '$scope', 'employers', 'LayoutHelper', function($scope, employers, LayoutHelper) {
      $scope.employerRows = LayoutHelper.group(employers, 6);
    } ]
  });
});