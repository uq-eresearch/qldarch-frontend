'use strict';

angular.module('qldarchApp').controller('InterviewCtrl',
    function($scope, interview, $state, $http, Uris, interviews, relationships, $stateParams, $location, $anchorScroll, $timeout) {
      // Setup

      $scope.sub = 'interviews';
      $scope.interviews = interviews;
      $scope.interview = interview;
      if (interview.transcript) {
        $scope.title = interview.label;
        $scope.isShowingTranscript = true;
      } else {
        $scope.title = 'Unknown Date';
        $scope.isShowingTranscript = false;
      }

      $scope.isSyncingTranscript = false;
      var audioPlayerDom = document.getElementById('audio1');
      $scope.audioPlayer = {};

      // Look for our external locations
      $scope.audioPlayerPlaylist = [];

      angular.forEach(interview.media, function(extLocation) {
        if (extLocation.type === 'Audio') {
          if (extLocation.mimetype === 'audio/mpeg') {
            $scope.audioPlayerPlaylist = [ {
              src : Uris.WS_MEDIA + extLocation.id,
              type : 'audio/mpeg'
            } ];
          } else if (extLocation.mimetype === 'audio/ogg') {
            $scope.audioPlayerPlaylist.push({
              src : Uris.WS_MEDIA + extLocation.id,
              type : 'audio/ogg'
            });
          }
        }
      });
      // console.log('playlist is', $scope.audioPlayerPlaylist);

      $scope.currentSpeaker = {};
      $scope.isSyncing = true;
      $scope.isSearching = false;

      function scrollToTime(time, duration) {
        console.log('scrolling to time!');
        console.log(time);
        if (!duration) {
          duration = 2000;
        }
        jQuery('html, body').animate({
          scrollTop : jQuery('#' + time).offset().top - 20
        }, duration);
      }

      $scope.$watch('isSyncing', function(isSyncing, isSyncingOld) {
        if (isSyncing === false && isSyncingOld === true) {
          // Its been turned off, check if there is a time and scroll
          if (angular.isDefined($scope.currentExchange)) {
            $timeout(function() {
              var startTime = $scope.currentExchange.startTime;
              scrollToTime(startTime, 1);
            }, 0);

          }
        }
      });

      // Amount of exchanges to display
      var exchangeDisplayCountDefault = 10;
      if ($stateParams.time) {
        $scope.startTime = $stateParams.time;
        angular.forEach(interview.transcript, function(exchange, index) {
          if (exchange.startTime.toString() === $stateParams.time.toString()) {
            console.log('once');
            $scope.exchangeDisplayCount = index + 20;
          }
        });
        setTimeout(function() {
          scrollToTime($stateParams.time, 2000);
          console.log('there is a time', $stateParams.time);
        }, 0);
      } else {
        $scope.exchangeDisplayCount = exchangeDisplayCountDefault;
      }

      /**
       * Sets the current exchange based on the current time
       * 
       * @param currentTime
       */
      function setCurrentExchangeFromTime(currentTime) {
        var index;
        if (interview.transcript) {
          angular.forEach($scope.interview.transcript, function(exchange, exchangeIndex) {
            if (currentTime < exchange.endTime && !angular.isDefined(index)) {
              index = exchangeIndex;
            }
          });
          if (index >= 0) {
            $scope.currentExchangeIndex = index;
            $scope.currentExchange = $scope.interview.transcript[index];
            // change request #36, only show photos of the interviewees.
            // i think the currentSpeaker is used for the photo on the
            // interview page and for nothing else (Andre)
            if ($scope.currentExchange.speaker && !$scope.currentExchange.speaker.isInterviewer) {
              $scope.currentSpeaker = $scope.currentExchange.speaker;
            } else {
              $scope.currentSpeaker = interview.interviewee[0].label;
            }
          }
        } else {
          $scope.currentSpeaker = interview.interviewee[0].label;
        }
      }

      /**
       * Cancels searching
       */
      function playing() {
        $scope.isSearching = false;
        $scope.transcriptSearchInput = '';
      }

      // Updates the current exchange from player
      $scope.$watch('audioPlayer.currentTime', setCurrentExchangeFromTime);
      // Cancels any searching when the play button is clicked
      $scope.$on('audioplayer:play', playing);

      /**
       * Adds more exchanges to the UI
       */
      $scope.addMoreExchanges = function() {
        $scope.exchangeDisplayCount += 10;
      };

      /**
       * Removes the add relationship box for an exchange.
       * 
       * @param {Object}
       *          exchange The exchange to close the exchange on
       */
      $scope.hideAddRelationship = function(exchange) {
        exchange.isAddingRelationship = false;
        exchange.isCreatingEntity = false;
        exchange.newRelationship = {};
      };

      $scope.showEditRelationships = function(exchange) {
        // Close any other ones that may be open
        angular.forEach($scope.interview.transcript, function(exchange) {
          $scope.hideAddRelationship(exchange);
        });
        $scope.audioPlayer.pause();
        exchange.isEditingRelationships = true;
      };
      $scope.hideEditRelationships = function(exchange) {
        exchange.isEditingRelationships = false;
      };

      /**
       * Show exchanges that haven't already been spoken
       * 
       * @param exchange
       * @returns {boolean}
       */
      $scope.timeFilter = function(exchange) {
        // console.log('audioPlayer currenttime: ' +
        // $scope.audioPlayer.currentTime);
        if ($scope.isSyncing && !$scope.isSearching) {
          if ($scope.audioPlayer.currentTime === 0) {
            return true;
          } else {
            return $scope.audioPlayer.currentTime < exchange.endTime;
          }
        } else {
          return true;
        }
      };

      // console.log('audioPlayer currenttime' +
      // $scope.audioPlayer.currentTime);
      var nextMatch = 0;

      /**
       * Search for text in the exchanges
       * 
       * @param transcriptSearchInput
       */
      $scope.transcriptSearchInputChanged = function(transcriptSearchInput) {
        $scope.isSearching = true;
        nextMatch = 0;
        $scope.audioPlayer.pause();
        $scope.exchangeDisplayCount = interview.transcript.length;

        if (transcriptSearchInput === '') {
          // cleared
          playing();
        }
      };

      $scope.transcriptSearchKeydown = function(e) {
        if (e.keyCode === 13) {
          var m = jQuery('.ui-match');
          if (m.length > 0) {
            if (nextMatch >= m.length) {
              nextMatch = 0;
            }
            jQuery('html, body').scrollTop(jQuery(m[nextMatch++]).offset().top - 20);
          }
        }
      };

      /**
       * Start playing the audio from a specific exchange
       * 
       * @param exchange
       */
      $scope.playFromExchange = function(exchange) {
        $scope.audioPlayer.pause();
        console.log('play from exchange');
        jQuery('html, body').animate({
          scrollTop : jQuery('.player').offset().top + 'px'
        }, 500, 'swing', function() {
          audioPlayerDom.currentTime = exchange.startTime;
          $scope.audioPlayer.currentTime = exchange.startTime;
          $scope.isSyncing = true;
          playing();
          $scope.audioPlayer.play();
        });
      };

      $scope.getRelationshipSubjectType = function(id, subject) {
        var type;
        angular.forEach(relationships, function(relationship) {
          if (id === relationship.relationshipid) {
            type = relationship.subjectype;
          } else if (subject === relationship.subject && !type) {
            type = relationship.subjectype;
          } else if (subject === relationship.object && !type) {
            type = relationship.objecttype;
          }
        });
        // console.log('subject: '+subject);
        // console.log('subjectype: '+type);
        return type;
      };

      $scope.getRelationshipObjectType = function(id, object) {
        var type;
        angular.forEach(relationships, function(relationship) {
          if (id === relationship.relationshipid) {
            type = relationship.objecttype;
          } else if (object === relationship.object && !type) {
            type = relationship.objecttype;
          } else if (object === relationship.subject && !type) {
            type = relationship.subjectype;
          }
        });
        // console.log('object: '+object);
        // console.log('objecttype: '+type);
        return type;
      };

      $scope.getRelationshipSubjectArchitect = function(id, subject) {
        var subjectarchitect;
        angular.forEach(relationships, function(relationship) {
          if (id === relationship.relationshipid) {
            subjectarchitect = relationship.subjectarchitect;
          } else if (subject === relationship.subject && !subjectarchitect) {
            subjectarchitect = relationship.subjectarchitect;
          } else if (subject === relationship.object && !subjectarchitect) {
            subjectarchitect = relationship.objectarchitect;
          }
        });
        // console.log('subject: '+subject);
        // console.log('subjectarchitect: '+subjectarchitect);
        return subjectarchitect;
      };

      $scope.getRelationshipObjectArchitect = function(id, object) {
        var objectarchitect;
        angular.forEach(relationships, function(relationship) {
          if (id === relationship.relationshipid) {
            objectarchitect = relationship.objectarchitect;
          } else if (object === relationship.object && !objectarchitect) {
            objectarchitect = relationship.objectarchitect;
          } else if (object === relationship.subject && !objectarchitect) {
            objectarchitect = relationship.subjectarchitect;
          }
        });
        // console.log('objectarchitect: '+objectarchitect);
        return objectarchitect;
      };

    });