'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('upload.interviews', {
    url : '/interviews',
    resolve : {
      interview : [ '$stateParams', 'ArchObj', function($stateParams, ArchObj) {
        if (!$stateParams.id) {
          return {};
        } else {
          return ArchObj.loadInterviewObj($stateParams.id).then(function(data) {
            return data;
          }).catch(function() {
            console.log('unable to load interview ArchObj with relationship labels');
            return {};
          });
        }
      } ],
      architects : [ 'AggArchObjs', 'GraphHelper', '$filter', function(AggArchObjs, GraphHelper, $filter) {
        return AggArchObjs.loadArchitects().then(function(data) {
          return $filter('filter')(data, function(architect) {
            return architect.label && !(/\s/.test(architect.label.substring(0, 1)));
          });
        }).catch(function() {
          console.log('unable to load architects');
          return {};
        });
      } ],
      personnotarchitect : [ 'AggArchObjs', function(AggArchObjs) {
        return AggArchObjs.loadPersonNotArchitect().then(function(data) {
          return data;
        }).catch(function() {
          console.log('unable to load person non-architect');
          return {};
        });
      } ]
    },
    templateUrl : 'views/upload/upload.interviews.html',
    controller : 'UploadInterviewsCtrl'
  });
});