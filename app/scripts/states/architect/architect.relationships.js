'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('architect.relationships', {
    url : '/relationships',
    templateUrl : 'views/relationships.html',
    controller : 'RelationshipCtrl',
    resolve : {
      data : [ 'architect', function(architect) {
        return angular.copy(architect);
      } ],
      relationships : [ 'data', function(data) {
        return data.relationships;
      } ],
      subject : [ 'data', '$filter', function(data, $filter) {
        var subj = {
          id : data.id,
          label : data.label,
          practicedinqueensland : data.practicedinqueensland,
          type : data.type,
          architect : data.architect,
          created : data.created
        };
        if (data.media.length > 0) {
          var m = $filter('filter')(data.media, function(media) {
            return media.preferred;
          });
          if (m.length === 0) {
            m = $filter('filter')(data.media, function(media) {
              return media.type === 'Photograph' || 'Portrait' || 'Image';
            });
          }
          if (m.length > 0) {
            subj.media = m[0].id;
            return subj;
          } else {
            return subj;
          }
        } else {
          return subj;
        }
      } ],
      interviews : [ 'Interviews', function(Interviews) {
        return Interviews.getInterviews();
      } ]
    }
  });
});