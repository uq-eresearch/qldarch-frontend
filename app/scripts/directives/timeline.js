'use strict';

angular.module('qldarchApp').directive('timeline', function($timeout) {
  var TIMELINE_HEIGHT = 600;
  var UPDATE_DELAY = 500;
  return {
    template : '<div></div>',
    restrict : 'E',
    replace : true,
    scope : {
      headline : '@', // 
      subtitle : '@', // subtitle
      asset : '=', // URL of image
      dates : '='
    },
    link : function postLink($scope, element) {
      // Generate a random id since we cant use jquery selectors
      // to initialize this timeline (annoying!)
      var id = 'timeline' + (new Date()).getTime();
      element.attr('id', id);

      function reset() {
        console.log('clearing timeline');
        element.removeClass();
        element.html('');
      }

      function create() {
        if (!$scope.dates.length) {
          return;
        }
        var timelineData = {
          timeline : {
            headline : $scope.headline || '',
            type : 'default',
            text : $scope.subtitle || '<p></p>',
            date : $scope.dates
          }
        };

        if (angular.isDefined($scope.asset)) {
          console.log('asset is', $scope.asset);
          timelineData.timeline.asset = $scope.asset;
        }

        createStoryJS({
          type : 'timeline',
          width : element.width(),
          height : TIMELINE_HEIGHT,
          source : timelineData,
          'embed_id' : id,
          css : 'bower_components/timelinejs/build/css/timeline.css',
          js : 'bower_components/timelinejs/build/js/timeline.js'
        });
      }

      function restart() {
        reset();
        $timeout(function() {
          create();
        }, 0);
      }

      var headlineTimer = null;
      $scope.$watch('headline', function(headline, headlineOld) {
        if (headline !== headlineOld) {
          if (headline === '') {
            // No headline
            reset();
          } else {
            // Changed headline
            // We wait a certain amount of time before doing the update
            if (headlineTimer) {
              $timeout.cancel(headlineTimer);
            }
            headlineTimer = $timeout(function() {
              restart();
            }, UPDATE_DELAY);
          }
        }
      });

      var subtitleTimer = null;
      $scope.$watch('subtitle', function(subtitle, subtitleOld) {
        if (subtitle !== subtitleOld) {
          if (subtitleTimer) {
            $timeout.cancel(subtitleTimer);
          }
          subtitleTimer = $timeout(function() {
            restart();
          }, UPDATE_DELAY);
        }
      });

      var datesTimer = null;
      /**
       * Watches dates for changes. Waits for a set delay before updating the
       * dates.
       * 
       * @param {[type]}
       *          dates
       * @return {[type]} [description]
       */
      $scope.$watch('dates', function(dates) {
        if (datesTimer) {
          $timeout.cancel(datesTimer);
        }
        datesTimer = $timeout(function() {
          if (dates && dates.length) {
            // Clear a timeline if its there, and create a new one
            restart();
          } else if (dates) {
            // No dates recorded, make no timeline
            reset();
          }
        }, UPDATE_DELAY);
      }, true);

    }
  };
});