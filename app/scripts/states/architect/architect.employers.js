'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('architect.employers', {
    url : '/employers',
    templateUrl : 'views/architect/employers.html',
    resolve : {
      employers : [ 'architect', '$filter', 'ArchObj', function(architect, $filter, ArchObj) {
        /* globals _:false */
        var employedby = $filter('filter')(architect.relationships, function(relationship) {
          if (relationship.relationship === 'employed by' && (relationship.subjectype === 'firm' || relationship.objecttype === 'firm')) {
            if (relationship.subjectype === 'firm') {
              relationship.firmlabel = relationship.subjectlabel;
            }
            if (relationship.objecttype === 'firm') {
              relationship.firmlabel = relationship.objectlabel;
            }         
            return ArchObj.load(relationship.subject).then(function(data) {
              if (angular.isUndefined(relationship.media)) {
                relationship.media = $filter('filter')(data.media, function(med) {
                  return (med.preferred || (med.type === ('Photograph' || 'Portrait' || 'Image')));
                }).id;
              }
              return relationship;
            }).catch(function() {
              console.log('unable to load relationship subject ArchObj');
              return {};
            });
          }
        });
        return _.uniqBy(employedby, 'firmlabel');
      } ]
    },
    controller : [ '$scope', 'employers', 'LayoutHelper', function($scope, employers, LayoutHelper) {
      $scope.employerRows = LayoutHelper.group(employers, 6);
    } ]
  });
});