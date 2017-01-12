'use strict';

angular.module('qldarchApp').run(
    function($rootScope, $route, $location, ngProgress, Uris, Entity, $http, GraphHelper, $state, $stateParams, Auth, $filter) {

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

      $http.get(Uris.JSON_ROOT + 'login/status').then(function(status) {
        angular.extend(Auth, status.data);
      });

      $rootScope.globalSearch = {};
      $rootScope.globalSearch.query = '';
      var tempFromState = {};
      // Adds the slim progress bar
      $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

        console.log('changing', event, toState, toParams, fromState, fromParams);

        // Catch if we are going to login
        if (toState.name === 'login' && fromState.name !== '') {
          tempFromState.fromState = fromState;
          tempFromState.fromParams = fromParams;
        }
        if (fromState.name === 'login' && toState.name !== 'forgot' && tempFromState.fromState.name !== 'forgot') {
          // Do we have a previous state stored?
          if (tempFromState.fromState) {
            event.preventDefault();
            var nextState = tempFromState;
            tempFromState = {};
            $state.go(nextState.fromState.name, nextState.fromParams);
          }
        }
        // event.preventDefault();
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
        return Entity.findByName(val, false).then(function(entities) {
          var results = GraphHelper.graphValues(entities);
          results = $filter('filter')(results, function(result) {
            return result.type === 'architect' || result.type === 'structure' || result.type === 'firm' || result.type === 'other';
          });
          results = $filter('orderBy')(results, function(result) {
            return result.name.length;
          });
          results = results.slice(0, 10);

          angular.forEach(results, function(result) {
            var label = result.name + ' (' + result.type.charAt(0).toUpperCase() + result.type.slice(1) + ')';
            if (result.type === 'structure') {
              label = result.name + ' (Project)';
            }
            result.name = label;
          });

          var search = {
            name : ' <i class="fa fa-search"></i> Search for \'' + val + '\'',
            type : 'search',
            query : val
          };
          results.push(search);
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
          $location.path('/search');
          $location.search('query', $item.query);
        } else {
          // already a result
          console.log('path is', $item.type);
          var url;
          if ($item.type === 'structure') {
            url = '/project/summary?' + $item.type + 'Id=' + $item.encodedUri;
          } else {
            url = '/' + $item.type + '/summary?' + $item.type + 'Id=' + $item.encodedUri;
          }

          var params = {};
          params[$item.type + 'Id'] = $item.encodedUri;
          $state.go($item.type + '.summary', params);
          console.log('url is', url);
        }
      };
    });