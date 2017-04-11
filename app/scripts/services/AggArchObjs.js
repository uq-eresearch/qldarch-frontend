'use strict';

angular.module('qldarchApp').factory('AggArchObjs', function($http, $cacheFactory, Uris) {

  // Public API here
  var aggarchobjs = {
    clearAll : function() {
      $cacheFactory.get('$http').removeAll();
    },

    loadArchitects : function() {
      return $http.get(Uris.WS_ROOT + 'architects').then(function(result) {
        console.log('load architects');
        return result.data;
      });
    },

    loadFirms : function() {
      return $http.get(Uris.WS_ROOT + 'firms').then(function(result) {
        console.log('load firms');
        return result.data;
      });
    },

    loadProjects : function() {
      return $http.get(Uris.WS_ROOT + 'projects').then(function(result) {
        console.log('load projects');
        return result.data;
      });
    },

    loadInterviews : function() {
      return $http.get(Uris.WS_ROOT + 'interviews').then(function(result) {
        console.log('load interviews');
        return result.data;
      });
    },

    loadInterviewsBrief : function() {
      return $http.get(Uris.WS_ROOT + 'interviews/brief').then(function(result) {
        console.log('load interviews brief');
        return result.data;
      });
    },

    loadArticles : function() {
      return $http.get(Uris.WS_ROOT + 'articles').then(function(result) {
        console.log('load articles');
        return result.data;
      });
    },

    loadPersonNotArchitect : function() {
      return $http.get(Uris.WS_ROOT + 'others/person/notarchitect').then(function(result) {
        console.log('load person non-architect');
        return result.data;
      });
    },

    loadOthersNotPerson : function() {
      return $http.get(Uris.WS_ROOT + 'others/notperson').then(function(result) {
        console.log('load others non-person');
        return result.data;
      });
    }
  };

  return aggarchobjs;
});