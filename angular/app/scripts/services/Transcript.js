'use strict';

angular.module('angularApp')
    .factory('Transcript', function (Request, Uris, ENV) {

        var convertToSeconds = function (timeString) {
            var parts = timeString.split(':');
            return parseInt(parts[0]) * 60 * 60 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
        };

        var getInitials = function (speaker) {
            if (speaker.name === 'Deborah van der Plaat') {
                return 'DV';
            } else {
                var firstInitial = speaker[Uris.FOAF_FIRST_NAME].charAt(0);
                var lastInitial = speaker[Uris.FOAF_LAST_NAME].charAt(0);
                return firstInitial + lastInitial;
            }
        };

        // Public API here
        return {

            /**
             * Load a transcript and incorporates the speakers
             * @param url               The url of the transcript
             * @param speakers          An array of speakers
             * @returns {Promise|*}
             */
            findWithUrl: function (url) {
                if (ENV.name === 'development') {
                    url = 'http://localhost:8080/qldarch/scripts/SCG_InterviewWithGrahamBligh.json';
                }
                console.log('transcript url', url);
                console.log('env name', ENV);
                return Request.http(url, {}, true).then(function (transcript) {
                    // We have the transcript
                    console.log('Transcript loaded');
                    return transcript;
                });
            },

            setupTranscript: function (transcript, args) {
                var defaults = {
                    interviewees: [],
                    interviewers: [],
                    relationships: []
                };

                args = angular.extend({}, defaults, args);

                // Transform start and end times to seconds for each exchange
                angular.forEach(transcript.exchanges, function (exchange, exchangeIndex) {
                    // Setup the start time in seconds
                    if (exchangeIndex !== 0) {
                        exchange.startTime = convertToSeconds(exchange.time);
                    } else {
                        exchange.startTime = 0;
                    }

                    // Setup the end time in seconds
                    if (angular.isDefined(transcript.exchanges[exchangeIndex + 1])) {
                        exchange.endTime = convertToSeconds(transcript.exchanges[exchangeIndex + 1].time);
                    } else {
                        exchange.endTime = 0;
                    }

                    // Try and match the supplied speaker initials, to the people
                    // we know were in the room
                    exchange.speakerInitials = exchange.speaker;
                    delete exchange.speaker;

                    var speakers = args.interviewers.concat(args.interviewees);

                    angular.forEach(speakers, function (speaker) {
                        if (getInitials(speaker) === exchange.speakerInitials) {
                            exchange.speaker = speaker;
                            if (args.interviewers.indexOf(speaker) !== -1) {
                                exchange.speaker.isInterviewer = true;
                            }
                        }
                    });

                    // Add in relationships to exchange
                    angular.forEach(args.relationships, function (relationship) {

                        angular.forEach(relationship.evidences, function (evidence) {
                            // Check that it has a from and to time
                            if (angular.isDefined(evidence[Uris.QA_TIME_FROM]) && angular.isDefined(evidence[Uris.QA_TIME_TO])) {

                                if (evidence[Uris.QA_TIME_FROM] >= exchange.startTime && evidence[Uris.QA_TIME_TO] <= exchange.endTime) {
                                    // We found a match
                                    if (!angular.isDefined(exchange.relationships)) {
                                        exchange.relationships = [];
                                    }
                                    // Add the relationship to the exchange
                                    exchange.relationships.push(relationship);
                                }
                            }
                        });
                    });
                });
                return transcript;
            }
        };
    });