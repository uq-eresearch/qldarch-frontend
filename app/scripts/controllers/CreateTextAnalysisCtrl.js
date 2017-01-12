'use strict';

angular
    .module('qldarchApp')
    .controller(
        'CreateTextAnalysisCtrl',
        function($scope, Entity, Uris, Solr, $filter, $state, Auth, CompoundObject) {
          $scope.test = '';
          $scope.wordcloud = {
            documents : []
          };

          var saved = false;
          /*
           * ===================================================== D3 Wordcloud
           * =====================================================
           */

          function makeWordCloud(text) {
            var fill = d3.scale.category20();
            var WIDTH = 960;
            var HEIGHT = 600;

            var tags, fontSize, maxLength = 30;

            var stopWords = /^(i|me|my|myself|we|us|our|ours|ourselves|you|your|yours|yourself|yourselves|he|him|his|himself|she|her|hers|herself|it|its|itself|they|them|their|theirs|themselves|what|which|who|whom|whose|this|that|these|those|am|is|are|was|were|be|been|being|have|has|had|having|do|does|did|doing|will|would|should|can|could|ought|i'm|you're|he's|she's|it's|we're|they're|i've|you've|we've|they've|i'd|you'd|he'd|she'd|we'd|they'd|i'll|you'll|he'll|she'll|we'll|they'll|isn't|aren't|wasn't|weren't|hasn't|haven't|hadn't|doesn't|don't|didn't|won't|wouldn't|shan't|shouldn't|can't|cannot|couldn't|mustn't|let's|that's|who's|what's|here's|there's|when's|where's|why's|how's|a|an|the|and|but|if|or|because|as|until|while|of|at|by|for|with|about|against|between|into|through|during|before|after|above|below|to|from|up|upon|down|in|out|on|off|over|under|again|further|then|once|here|there|when|where|why|how|all|any|both|each|few|more|most|other|some|such|no|nor|not|only|own|same|so|than|too|very|say|says|said|shall)$/,
            wordSeparators = /[\s\u3031-\u3035\u309b\u309c\u30a0\u30fc\uff70]+/g, discard = /^(@|https?:)/;

            function draw(words) {
              d3.select('.l-frame-media .container .wordcloud').append('svg').attr('width', WIDTH).attr('height', HEIGHT).append('g').attr(
                  'transform', 'translate(' + WIDTH / 2 + ', ' + HEIGHT / 2 + ')').selectAll('text').data(words).enter().append('text').style(
                  'font-size', function(d) {
                    return d.size + 'px';
                  }).style('font-family', 'Impact').style('fill', function(d, i) {
                return fill(i);
              }).attr('text-anchor', 'middle').attr('transform', function(d) {
                return 'translate(' + [ d.x, d.y ] + ')rotate(' + d.rotate + ')';
              }).text(function(d) {
                return d.text;
              });
            }

            function generate(tags) {
              fontSize = d3.scale.log().range([ 10, 100 ]);

              d3.layout.cloud().size([ WIDTH, HEIGHT ]).words(tags.slice(0, Math.min(tags.length, 250))).padding(5).rotate(function() {
                return 0;
                // return Math.floor((Math.random() * 2) * 90);
              }).font('Lato').fontSize(function(d) {
                console.log('value is', d.value);
                return fontSize(+d.value);
              }).text(function(d) {
                return d.key;
              }).on('end', draw).start();
            }

            function parseText(text) {
              tags = {};
              var cases = {};
              text.split(wordSeparators).forEach(function(word) {
                if (discard.test(word)) {
                  return;
                }
                word = word.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g, '');
                if (stopWords.test(word.toLowerCase())) {
                  return;
                }
                word = word.substr(0, maxLength);
                cases[word.toLowerCase()] = word;
                tags[word = word.toLowerCase()] = (tags[word] || 0) + 1;
              });
              tags = d3.entries(tags).sort(function(a, b) {
                return b.value - a.value;
              });
              tags.forEach(function(d) {
                d.key = cases[d.key];
              });
              generate(tags);
              // 
              console.log('tags', tags, 'cases', cases);
            }

            jQuery('.l-frame-media .container .wordcloud').html('');
            parseText(text);

          }

          /*
           * ===================================================== Import Places
           * =====================================================
           */

          $scope.importSelectionChanged = function() {
            var selected = $filter('filter')($scope.wordcloud.$import.documents, function(document) {
              return document.$selected;
            });
            $scope.wordcloud.$import.numberToImport = selected.length;
          };

          /**
           * Watches for the import entity to be changed, and fetches a list of
           * structures
           * 
           * @param {[type]}
           *          entity [description]
           * @return {[type]} [description]
           */
          $scope.$watch('wordcloud.$import.entity', function(entity) {
            if (!entity) {
              return;
            }
            // Clear the current locations
            $scope.wordcloud.$import.documents = null;

            // Do a search for documents
            Solr.query({
              query : entity.name
            }).then(function(documents) {
              // Got the documents
              $scope.wordcloud.$import.documents = documents;
              angular.forEach(documents, function(document) {
                document.$selected = true;
              });
              $scope.importSelectionChanged();
              console.log('documents', documents);
            });

          });

          /**
           * Adds a list of documents (if selected) to the word cloud
           * visualisation
           * 
           * @param {[type]}
           *          documents [description]
           * @return {[type]} [description]
           */
          $scope.import = function(documents) {
            documents = $filter('filter')(documents, function(document) {
              return document.$selected;
            });
            console.log('documents', documents);

            $scope.wordcloud.documents = documents.concat($scope.wordcloud.documents);
            $scope.wordcloud.$import = {
              entity : null,
              documents : []
            };
            $state.go('create.textAnalysis');
          };

          /*
           * ===================================================== New Place
           * =====================================================
           */
          $scope.addDocument = function(document) {
            // Store the location
            $scope.wordcloud.documents.unshift(document);
            console.log('document is ', document);
            // Clear the entry
            $scope.wordcloud.$tempDocument = {
              type : 'new'
            };
            $state.go('create.textAnalysis');
          };

          /*
           * ===================================================== Delete
           * Locations =====================================================
           */
          $scope.remove = function(document) {
            var index = $scope.wordcloud.documents.indexOf(document);
            $scope.wordcloud.documents.splice(index, 1);
          };

          /*
           * ===================================================== Render
           * Visualisation =====================================================
           */
          $scope.$watchCollection('wordcloud.documents', function(documents) {
            console.log('documents', documents);
            if (documents && documents.length) {
              var text = '';
              angular.forEach($scope.wordcloud.documents, function(document) {
                text += document.text || '';
              });
              console.log('text is', text);
              makeWordCloud(text);
            }
          });

          /*
           * ===================================================== Save Map
           * =====================================================
           */
          $scope.save = function() {
            if (!saved) {
              var compoundObject = {};
              compoundObject.title = $scope.map.title;
              compoundObject.user = Auth;
              compoundObject.type = 'map';
              compoundObject.data = $scope.map;

              CompoundObject.store(compoundObject).then(function(data) {
                $state.go('content.textAnalysis', {
                  contentId : data.encodedUri
                });
              });
              saved = true;
            } else {
              alert('need to do put');
            }
          };

          /*
           * ===================================================== Select2 Boxes
           * =====================================================
           */
          function format(entity) {
            var imgSrc = 'images/icon.png';
            if (entity.picture) {
              imgSrc = Uris.THUMB_ROOT + entity.picture[Uris.QA_SYSTEM_LOCATION];
            }

            return '<img class="select2-thumb" src="' + imgSrc + '" />' + entity.text;
          }
          // Setup the entity select boxes
          $scope.architectStructureFirmTypologySelect = {
            placeholder : 'Architect, Project, Firm or Typology',
            dropdownAutoWidth : true,
            multiple : false,
            formatResult : format,
            formatSelection : format,
            escapeMarkup : function(m) {
              return m;
            },
            // minimumInputLength: 2,
            query : function(options) {
              Entity.findByName(options.term, false).then(function(entities) {
                var data = {
                  results : []
                };

                angular.forEach(entities, function(entity) {
                  if (entity.type === 'architect' || entity.type === 'firm' || entity.type === 'structure') {

                    var label = entity.name + ' (' + entity.type.charAt(0).toUpperCase() + entity.type.slice(1) + ')';
                    if (entity.type === 'structure') {
                      label = entity.name + ' (Project)';
                    }

                    data.results.push({
                      id : entity.uri,
                      uri : entity.uri,
                      text : label,
                      type : entity.type,
                      name : entity.name,
                      encodedUri : entity.encodedUri,
                      picture : entity.picture
                    });
                  }

                });
                options.callback(data);
              });
            }
          };

        });