'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('others', {
    url : '/others',
    templateUrl : 'views/other/others.html',
    resolve : {
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
      } ]
    },
    controller : 'OthersCtrl'
  });
});