'use strict';

angular.module('angularApp')
// interview, transcript, evidences
.controller('InterviewCtrl', function ($scope, interview, $http, Uris, Entity, Ontology, architect, interviews, $stateParams, $location, $anchorScroll, $timeout, GraphHelper) {
    // Setup



    $scope.sub = 'interviews';
    $scope.interviews = interviews;
    $scope.architect = architect;
    $scope.interview = interview;
    if (interview.transcript) {
        $scope.title = interview.transcript.date.toLowerCase();
        $scope.isShowingTranscript = true;
    } else {
        $scope.title = 'Unknown Date';
        $scope.isShowingTranscript = false;
    }

    $scope.isSyncingTranscript = false;
    var audioPlayerDom = document.getElementById('audio1');
    $scope.audioPlayer = {};


    // Look for our external locations
    angular.forEach(GraphHelper.asArray(interview[Uris.QA_EXTERNAL_LOCATION]), function (extLocation) {
        if (extLocation.indexOf('you') === -1) {
            // Not found, use this
            $scope.audioPlayerPlaylist = [{
                src: extLocation,
                type: 'audio/ogg'
            }, {
                src: extLocation.substring(0, extLocation.length - 3) + 'mp3',
                type: 'audio/mp3'
            }];
        } else {
            // Deal with youtube here
        }
    });

    // $scope.audioPlayerPlaylist = [{
    //     src: 'audio/bligh.mp3',
    //     type: 'audio/mp3'
    // }, {
    //     src: 'audio/bligh.ogg',
    //     type: 'audio/ogg'
    // }];
    $scope.currentSpeaker = {};
    $scope.isSyncing = true;
    $scope.isSearching = false;

    function scrollToTime(time, duration) {
        console.log('scrolling to time!');
        if (!duration) {
            duration = 2000;
        }
        jQuery('html, body').animate({
            scrollTop: jQuery('#' + time).offset().top - 20
        }, duration);
    }

    $scope.$watch('isSyncing', function (isSyncing, isSyncingOld) {
        if (isSyncing === false && isSyncingOld === true) {
            // Its been turned off, check if there is a time and scroll
            if (angular.isDefined($scope.currentExchange)) {
                $timeout(function () {
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
        angular.forEach(interview.transcript.exchanges, function (exchange, index) {
            if (exchange.startTime.toString() === $stateParams.time.toString()) {
                console.log('once');
                $scope.exchangeDisplayCount = index + 20;
            }
        });

        setTimeout(function () {
            // $location.hash($stateParams.time);
            // $anchorScroll();

            scrollToTime($stateParams.time, 2000);

            console.log('there is a time', $stateParams.time);
        }, 0);

    } else {
        $scope.exchangeDisplayCount = exchangeDisplayCountDefault;
    }



    /**
     * Sets the current exchange based on the current time
     * @param currentTime
     */
    function setCurrentExchangeFromTime(currentTime) {
        var index;
        if (interview.transcript) {
            angular.forEach($scope.interview.transcript.exchanges, function (exchange, exchangeIndex) {
                if (currentTime < exchange.endTime && !angular.isDefined(index)) {
                    index = exchangeIndex;
                }
            });
            if (index >= 0) {
                $scope.currentExchangeIndex = index;
                $scope.currentExchange = $scope.interview.transcript.exchanges[index];
                $scope.currentSpeaker = $scope.interview.transcript.exchanges[index].speaker;
            }
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
    //  Cancels any searching when the play button is clicked
    $scope.$on('audioplayer:play', playing);

    // Setup the select boxes
    $scope.entitySelectOptions = {
        placeholder: 'Subject',
        dropdownAutoWidth: true,
        minimumInputLength: 2,
        query: function (options) {
            Entity.findByName(options.term, false).then(function (entities) {
                var data = {
                    results: []
                };
                angular.forEach(entities, function (entity) {
                    data.results.push({
                        id: entity.uri,
                        uri: entity.uri,
                        text: entity.name,
                        type: entity.type,
                        name: entity.name,
                        encodedUri: entity.encodedUri
                    });
                });
                options.callback(data);
            });
        }
    };
    $scope.relationshipSelectOptions = {
        placeholder: 'Relationship',
        dropdownAutoWidth: true,
        minimumInputLength: 2,
        query: function (options) {
            Ontology.findPropertyByName(options.term).then(function (properties) {
                var data = {
                    results: []
                };
                angular.forEach(properties, function (property) {
                    data.results.push({
                        id: property.uri,
                        uri: property.uri,
                        text: property.name,
                        name: property.name,
                        encodedUri: property.encodedUri,
                        entailsRelationship: property[Uris.QA_ENTAILS_RELATIONSHIP]
                    });
                });
                options.callback(data);
            });
        }
    };






    /**
     * Adds more exchanges to the UI
     */
    $scope.addMoreExchanges = function () {
        $scope.exchangeDisplayCount += 10;
    };

    /**
     * Shows the add relationship box.
     *
     * Shows the controls and pauses the audio.
     *
     * @param  {Object} exchange The exchange to add the relationship
     */
    $scope.showAddRelationship = function (exchange) {
        // Close any other ones that may be open
        angular.forEach($scope.interview.transcript.exchanges, function (exchange) {
            $scope.hideAddRelationship(exchange);
        });
        $scope.audioPlayer.pause();
        exchange.isAddingRelationship = true;
        exchange.newRelationship.subject = $scope.interview.interviewees[0];
        exchange.newRelationship.subject.text = $scope.interview.interviewees[0].name;
    };
    /**
     * Removes the add relationship box for an exchange.
     * @param  {Object} exchange The exchange to close the exchange on
     */
    $scope.hideAddRelationship = function (exchange) {
        exchange.isAddingRelationship = false;
        exchange.newRelationship = {};
    };

    $scope.showEditRelationships = function (exchange) {
        // Close any other ones that may be open
        angular.forEach($scope.interview.transcript.exchanges, function (exchange) {
            $scope.hideAddRelationship(exchange);
        });
        $scope.audioPlayer.pause();
        exchange.isEditingRelationships = true;
    };
    $scope.hideEditRelationships = function (exchange) {
        exchange.isEditingRelationships = false;
    };
    /**
     *
     * @param evidence
     * @param exchange
     */
    $scope.deleteRelationship = function (relationship, exchange) {
        // Splice out the relationship
        var index = exchange.relationships.indexOf(relationship);
        exchange.relationships.splice(index, 1);

        console.log('relationship', relationship);
        angular.forEach(relationship.evidences, function (evidence) {
            $http.delete('/ws/rest/annotation/evidence?ID=' + encodeURIComponent(evidence.uri)).
            catch (function () {
                // Failed to delete
                alert('Whoops, looks like the annotation couldn\'t be deleted at this time.');
                // Put the relationship back in
                exchange.relationships.push(relationship);
            });
        });
    };

    /**
     *
     * @param {[type]} relationship [description]
     * @param {[type]} exchange     [description]
     */
    $scope.addRelationshipToExchange = function (relationship, exchange) {

        // Lets build up our request
        var annotation = {};
        annotation[Uris.RDF_TYPE] = relationship.predicate.entailsRelationship;


        annotation[Uris.QA_SUBJECT] = relationship.subject.uri;
        annotation[Uris.QA_PREDICATE] = relationship.predicate.uri;
        annotation[Uris.QA_OBJECT] = relationship.object.uri;

        if (relationship.startYear && relationship.startYear.length) {
            annotation[Uris.QA_START_DATE] = relationship.startYear + '-01-01';
        }
        if (relationship.endYear && relationship.endYear.length) {
            annotation[Uris.QA_END_DATE] = relationship.endYear + '-01-01';
        }
        if (relationship.note && relationship.note.length) {
            annotation[Uris.QA_TEXTUAL_NOTE] = relationship.note;
        }
        annotation[Uris.QA_OBJECT] = relationship.object.uri;

        annotation[Uris.QA_EVIDENCE] = {};
        annotation[Uris.QA_EVIDENCE][Uris.RDF_TYPE] = Uris.QA_EVIDENCE_TYPE;
        annotation[Uris.QA_EVIDENCE][Uris.QA_DOCUMENTED_BY] = $scope.interview.uri;
        annotation[Uris.QA_EVIDENCE][Uris.QA_TIME_FROM] = exchange.startTime;
        annotation[Uris.QA_EVIDENCE][Uris.QA_TIME_TO] = exchange.endTime;

        if (!angular.isDefined(exchange.relationships)) {
            exchange.relationships = [];
        }
        exchange.relationships.push(relationship);
        exchange.newRelationship = {};

        $http.post('/ws/rest/annotation', annotation).then(function (response) {
            // Merge the response in, with our new annotation object
            angular.extend(relationship, response.data);
        });

        $scope.hideAddRelationship(exchange);

        //			var annotationRequestObject = {
        //				"http://www.w3.org/1999/02/22-rdf-syntax-ns#type": relationship.predicate[Uris.QA_ENTAILS_RELATIONSHIP],
        //				"http://qldarch.net/ns/rdf/2012-06/terms#subject":  relationship.subject.uri,
        //				"http://qldarch.net/ns/rdf/2012-06/terms#predicate": relationship.predicate.uri,
        //				"http://qldarch.net/ns/rdf/2012-06/terms#object": relationship.object.uri,
        //				"http://qldarch.net/ns/rdf/2012-06/terms#startDate": "1919-01-01",
        //				"http://qldarch.net/ns/rdf/2012-06/terms#endDate": "1920-01-01",
        //				"http://qldarch.net/ns/rdf/2012-06/terms#textualNote": relationship.,
        //				"http://qldarch.net/ns/rdf/2012-06/terms#evidence": {
        //					"http://www.w3.org/1999/02/22-rdf-syntax-ns#type": Uris.QA_EVIDENCE_TYPE,
        //					"http://qldarch.net/ns/rdf/2012-06/terms#documentedBy": $scope.interview.uri,
        //					"http://qldarch.net/ns/rdf/2012-06/terms#timeFrom": exchange.startTime,
        //					"http://qldarch.net/ns/rdf/2012-06/terms#timeTo": exchange.endTime
        //				}
        //			};
        //
        //			// Check if hte start end or note are defined, the rest are required
        //			if(relationship.startDate.length) {
        //				annotationRequestObject[Uris.QA_START_DATE] = relationship.startDate;
        //			}
        //			if(relationship.endDate.length) {
        //				annotationRequestObject[Uris.QA_END_DATE] = relationship.endDate;
        //			}
        //			if(relationship.textualNote.length) {
        //				annotationRequestObject[Uris.QA_TEXTUAL_NOTE] = relationship.textualNote;
        //			}

        //
        //			$http.post('/ws/rest/annotation', annotationRequestObject).then(function (response) {
        //				console.log("got response", response.data);
        //				// Merge the response in, with our new annotation object
        //				angular.extend(relationship, response.data);
        //			});

    };

    /**
     * Show exchanges that haven't already been spoken
     * @param exchange
     * @returns {boolean}
     */
    $scope.timeFilter = function (exchange) {
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

    /**
     * Search for text in the exchanges
     * @param transcriptSearchInput
     */
    $scope.transcriptSearchInputChanged = function (transcriptSearchInput) {
        $scope.isSearching = true;
        $scope.audioPlayer.pause();
        $scope.exchangeDisplayCount = exchangeDisplayCountDefault;

        if (transcriptSearchInput === '') {
            // cleared
            playing();
        }
    };

    /**
     * Start playing the audio from a specific exchange
     * @param exchange
     */
    $scope.playFromExchange = function (exchange) {
        $scope.audioPlayer.pause();

        console.log('play from exchange');
        // jQuery('html, body').scrollTop(jQuery('#transcript').offset().top - 20);
        // 
        jQuery('html, body').animate({
            scrollTop: jQuery('.player').offset().top + 'px'
        }, 500, 'swing', function () {
            audioPlayerDom.currentTime = exchange.startTime;
            $scope.audioPlayer.currentTime = exchange.startTime;
            $scope.isSyncing = true;
            playing();
            $scope.audioPlayer.play();
        });
    };



    /**
     * Adds a new connection between two entities with current exchange as evidence
     * @param exchange
     */
    $scope.addAnnotation = function (newAnnotation, exchange) {




        //          $http.post('/ws/rest/login', $.param({
        //            username: "admin",
        //            password: "password"
        //          }), {
        //            headers: {
        //              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        //            }
        //          }).then(function(response) {
        //
        //          });

        //          //
        //          http://qldarch.net/ns/rdf/2012-06/terms#documentedBy: "http://qldarch.net/omeka/items/show/1771"
        //            http://qldarch.net/ns/rdf/2012-06/terms#timeFrom: 3
        //              http://qldarch.net/ns/rdf/2012-06/terms#timeTo: 44
        //                http://www.w3.org/1999/02/22-rdf-syntax-ns#type: "http://qldarch.net/ns/rdf/2012-06/terms#Evidence"
        //                  http://qldarch.net/ns/rdf/2012-06/terms#object: "http://qldarch.net/users/patriciadowling/Architect#61556425169"
        //                    http://qldarch.net/ns/rdf/2012-06/terms#predicate: "http://qldarch.net/ns/rdf/2012-06/terms#clientOf"
        //                      http://qldarch.net/ns/rdf/2012-06/terms#subject: "http://qldarch.net/users/patriciadowling/Architect#61556425169"
        //                        http://www.w3.org/1999/02/22-rdf-syntax-ns#type: "http://qldarch.net/ns/rdf/2012-06/terms#ClientOfRelation"
    }
});