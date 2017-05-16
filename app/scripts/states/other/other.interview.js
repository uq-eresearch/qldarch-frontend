'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('other.interview', {
    url : '/interview/:interviewId?time',
    templateUrl : 'views/other/interview.html',
    controller : 'InterviewCtrl',
    resolve : {
      relationships : [ 'other', function(other) {
        return other.relationships;
      } ],
      interview : [ '$stateParams', 'ArchObj', function($stateParams, ArchObj) {
        return ArchObj.loadInterviewObj($stateParams.interviewId).then(function(data) {
          return data;
        }).catch(function() {
          console.log('unable to load interview ArchObj with relationship labels');
          return {};
        });
      } ],
      types : [ 'RelationshipLabels', function(RelationshipLabels) {
        return RelationshipLabels.load().then(function(response) {
          return response;
        });
      } ],
      personnotarchitect : [ 'AggArchObjs', function(AggArchObjs) {
        return AggArchObjs.loadPersonNotArchitect().then(function(data) {
          return data;
        }).catch(function() {
          console.log('unable to load person non-architect');
          return {};
        });
      } ],
      othersnotperson : [ 'AggArchObjs', function(AggArchObjs) {
        return AggArchObjs.loadOthersNotPerson().then(function(data) {
          return data;
        }).catch(function() {
          console.log('unable to load others non-person');
          return {};
        });
      } ],
      others : [ 'personnotarchitect', 'othersnotperson', function(personnotarchitect, othersnotperson) {
        return personnotarchitect.concat(othersnotperson);
      } ],
      architects : [ 'AggArchObjs', function(AggArchObjs) {
        return AggArchObjs.loadArchitects().then(function(data) {
          angular.forEach(data, function(d) {
            d.type = 'person';
          });
          return data;
        }).catch(function() {
          console.log('unable to load architects');
          return {};
        });
      } ],
      firms : [ 'AggArchObjs', function(AggArchObjs) {
        return AggArchObjs.loadFirms().then(function(data) {
          angular.forEach(data, function(d) {
            d.type = 'firm';
          });
          return data;
        }).catch(function() {
          console.log('unable to load firms');
          return {};
        });
      } ],
      structures : [ 'AggArchObjs', function(AggArchObjs) {
        return AggArchObjs.loadProjects().then(function(data) {
          angular.forEach(data, function(d) {
            d.type = 'structure';
          });
          return data;
        }).catch(function() {
          console.log('unable to load projects');
          return {};
        });
      } ],
      entities : [ 'architects', 'firms', 'structures', 'others', function(architects, firms, structures, others) {
        var entities = [];
        Array.prototype.push.apply(entities, architects);
        Array.prototype.push.apply(entities, firms);
        Array.prototype.push.apply(entities, structures);
        Array.prototype.push.apply(entities, others);
        return entities;
      } ]
    }
  });
});