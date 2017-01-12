'use strict';

angular.module('qldarchApp').factory('Transcript', function(Request, Uris, ENV, Expression, File) {

  var convertToSeconds = function(timeString) {
    var parts = timeString.split(':');
    return parseInt(parts[0]) * 60 * 60 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
  };

  var extractInitials = function(speaker) {
    if (speaker.name === 'Deborah van der Plaat') {
      return 'DV';
    } else {
      var firstInitial = '', lastInitial = '';
      if (angular.isDefined(speaker[Uris.FOAF_FIRST_NAME])) {
        firstInitial = speaker[Uris.FOAF_FIRST_NAME].charAt(0);
      }
      if (angular.isDefined(speaker[Uris.FOAF_LAST_NAME])) {
        lastInitial = speaker[Uris.FOAF_LAST_NAME].charAt(0);
      }
      return firstInitial + lastInitial;
    }
  };

  // Public API here
  function getStartTime(exchange) {
    if (!exchange.time) {
      return 0;
    }
    return convertToSeconds(exchange.time);
  }

  function isLastExchange(exchange, exchanges) {
    return exchanges.indexOf(exchange) === exchanges.length - 1;
  }
  function nextExchange(exchange, exchanges) {
    var nextIndex = exchanges.indexOf(exchange) + 1;
    if (nextIndex >= exchanges.length) {
      throw new Error('Can\'t find next exchange');
    }
    return exchanges[nextIndex];
  }

  function getEndTime(exchange, exchanges) {
    if (isLastExchange(exchange, exchanges)) {
      exchange.endTime = 999999;
      return exchange.endTime;
    }
    return convertToSeconds(nextExchange(exchange, exchanges).time);
  }

  function evidenceHasTimes(evidence) {
    return angular.isDefined(evidence[Uris.QA_TIME_FROM]) && angular.isDefined(evidence[Uris.QA_TIME_TO]);
  }

  function getEvidenceStartTime(evidence) {
    return parseInt(evidence[Uris.QA_TIME_FROM]);
  }

  function timeIsBetween(time, startTime, endTime) {
    return startTime <= time && time <= endTime;
  }

  function evidenceRelatesToExchange(evidence, exchange, exchanges) {
    if (!evidenceHasTimes(evidence)) {
      return false;
    }
    evidence.startTime = getEvidenceStartTime(evidence);
    if (isLastExchange(exchange, exchanges)) {
      return exchange.startTime <= evidence.startTime;
    }
    return timeIsBetween(evidence.startTime, exchange.startTime, exchange.endTime);
  }

  function relationshipMentionedInExchange(relationship, exchange, exchanges) {
    var isMentioned = false;
    angular.forEach(relationship.evidences, function(evidence) {
      isMentioned = isMentioned || evidenceRelatesToExchange(evidence, exchange, exchanges);
    });
    return isMentioned;
  }

  function getRelationships(exchange, exchanges, allRelationships) {
    return allRelationships.filter(function(relationship) {
      return relationshipMentionedInExchange(relationship, exchange, exchanges);
    });
  }

  function getInitials(exchange) {
    return exchange.speaker;
  }

  function getSpeakerMatchingInitials(initials, interviewers, interviewees) {
    var speakers = interviewers.concat(interviewees);

    var possibleSpeakers = speakers.filter(function(speaker) {
      return extractInitials(speaker) === initials;
    });
    if (!possibleSpeakers.length) {
      return null;
    }
    var speaker = possibleSpeakers[0];
    if (interviewers.indexOf(speaker) !== -1) {
      speaker.isInterviewer = true;
    }
    return speaker;
  }

  return {

    /**
     * Gets the transcript file from an interview
     * 
     * Handles the problems that the HAS_TRANSCRIPT property from omeka is an
     * expression but from internal its just file uril
     * 
     * @param {[type]}
     *          uri The uri of the transcript (QA_HAS_TRANSCRIPT) property
     * @return {[type]} [description]
     */
    findFileFromInterviewKludge : function(uri) {
      if (uri.indexOf('omeka') !== -1) {
        // its an omeka one
        return Expression.load(uri).then(function(expression) {
          return File.load(expression[Uris.QA_HAS_FILE]);
        });
      } else {
        return File.load(uri);
      }
    },

    /**
     * Load a transcript and incorporates the speakers
     * 
     * @param url
     *          The url of the transcript
     * @param speakers
     *          An array of speakers
     * @returns {Promise|*}
     */
    findWithUrl : function(url) {
      // Kluge to fix hardcoded absolute transcript urls
      // that are stored in the RDF store
      // when they shouldn't be
      // this is how its was coming from omeka
      // @todo: probably should be removed at some stage
      var devString = 'http://qldarch-test.metadata.net';
      var prodString = 'http://qldarch.net';
      if (url.indexOf(devString) !== -1) {
        url = url.substring(devString.length);
      } else if (url.indexOf(prodString) !== -1) {
        url = url.substring(prodString.length);
      }

      return Request.http(url, {}, true).then(function(transcript) {
        return transcript;
      });
    },

    setupTranscript : function(transcript, args) {
      var defaults = {
        interviewees : [],
        interviewers : [],
        relationships : []
      };

      args = angular.extend({}, defaults, args);

      // Transform start and end times to seconds for each exchange
      angular.forEach(transcript.exchanges, function(exchange) {
        exchange.startTime = getStartTime(exchange);
        exchange.endTime = getEndTime(exchange, transcript.exchanges);
        exchange.speakerInitials = getInitials(exchange);
        exchange.speaker = getSpeakerMatchingInitials(exchange.speakerInitials, args.interviewers, args.interviewees);
        exchange.relationships = getRelationships(exchange, transcript.exchanges, args.relationships);
      });
      return transcript;
    }
  };
});