'use strict';

angular.module('qldarchApp').run(function($rootScope, $route, $location, ngProgress, Uris, $http, GraphHelper, $state, $stateParams, Auth, $filter, WordService) {

  // Fix bug with scrolling to top with ui-router changing
  $rootScope.$on('$viewContentLoaded', function() {
    var interval = setInterval(function() {
      if (document.readyState === 'complete') {
        window.scrollTo(0, 0);
        clearInterval(interval);
      }
    }, 200);
  });

  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
  $rootScope.Auth = Auth;
  $rootScope.Uris = Uris;
  $rootScope.tinymceOptions = {
    plugins : 'paste',
    /* jshint camelcase: false */
    paste_as_text : true,
    menubar : false,
    toolbar : 'bold | italic',
    statusbar : false
  };

  $http.get(Uris.WS_ROOT + 'user').then(function(status) {
    if (status.data.id) {
      Auth.success = true;
      Auth.user = status.data;
      console.log('Auth is', status.data.username);
    }
  });

  $rootScope.globalSearch = {};
  $rootScope.globalSearch.query = '';

  // Adds the slim progress bar
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    console.log('changing', event, toState, toParams, fromState, fromParams);
    ngProgress.reset();
    ngProgress.color('#ea1d5d');
    ngProgress.start();
  });
  $rootScope.$on('$stateChangeSuccess', function() {
    ngProgress.complete();
    $rootScope.globalSearch.query = '';
  });
  $rootScope.$on('$stateChangeError', function() {
    ngProgress.reset();
    ngProgress.reset();
  });

  /**
   * Finds entities with matching names
   * 
   * @param val
   * @returns {Promise|*}
   */
  $rootScope.globalSearch = function(val) {
    var syntax = '* AND (type:person OR type:firm OR type:structure) AND category:archobj';
    return $http.get(Uris.WS_ROOT + 'search?q=' + val.replace(WordService.spclCharsLucene, '') + syntax + '&p=0&pc=20').then(function(output) {
      var results = GraphHelper.graphValues(output.data.documents);
      results = $filter('filter')(results, function(result) {
        return (result.type === 'person' || result.type === 'firm' || result.type === 'structure');
      });
      results = $filter('orderBy')(results, function(result) {
        return result.label.length;
      });
      results = results.slice(0, 10);

      angular.forEach(results, function(result) {
        result.name = result.label;
        var label = result.name + ' (' + result.type.charAt(0).toUpperCase() + result.type.slice(1) + ')';
        if (result.type === 'structure') {
          label = result.name + ' (Project)';
        }
        result.name = label;
      });

      var search = {
        name : 'Search for \'' + val + '\'',
        type : 'search',
        query : val
      };
      results.unshift(search);
      return results;
    });
  };

  /**
   * 
   * @param $item
   * @param $model
   * @param $label
   */
  $rootScope.globalSearchOnSelect = function($item, $model) {
    if ($item.type === 'search') {
      // special case
      $rootScope.globalSearch.query = $item.query;
      $model = $item.query;
      $location.search({});
      $location.path('/search');
      $location.search('query', $item.query);
    } else {
      // already a result
      console.log('path is', $item.type);
      var params = {};
      if ($item.type === 'person' && $item.architect === true) {
        params.architectId = $item.id;
        $state.go('architect.summary', params);
      } else if ($item.type === 'person' && $item.architect === false) {
        params.otherId = $item.id;
        $state.go('other.summary', params);
      } else if ($item.type === 'firm') {
        params.firmId = $item.id;
        $state.go('firm.summary', params);
      } else if ($item.type === 'structure') {
        params.structureId = $item.id;
        $state.go('structure.summary', params);
      } else if ($item.type === 'Article') {
        params.articleId = $item.id;
        $state.go('article', params);
      } else if ($item.type === 'interview') {
        params.interviewId = $item.id;
        $state.go('interview', params);
      }
    }
  };
});