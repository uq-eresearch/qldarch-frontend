'use strict';

angular.module('qldarchApp').controller(
    'WordCloudViewerCtrl',
    function($scope, compobj, CompObj, $state, Auth, WordCloudService) {

      $scope.compoundObject = compobj;
      $scope.wordcloud = compobj;

      if (angular.isDefined(Auth.user) && angular.isDefined($scope.compoundObject.user)) {
        $scope.isDeletable = Auth.success && ($scope.compoundObject.user.displayName === Auth.user.displayName || Auth.user.role === 'admin');
      }

      $scope.delete = function() {
        var r = window.confirm('Delete this word cloud?');
        if (r === true) {
          CompObj.delete(compobj.id).then(function() {
            $state.go('main');
          });
        }
      };

      // D3 Wordcloud
      function makeWordCloud(text) {
        var fill = d3.scale.category20();
        var WIDTH = 900;
        var HEIGHT = 600;

        var tags, fontSize, maxLength = 30;

        var stopWords = WordCloudService.stopWords;
        var wordSeparators = WordCloudService.wordSeparators;
        var discard = WordCloudService.discard;

        function draw(words) {
          d3.select('.l-frame-media .container .wordcloud').append('svg').attr('width', WIDTH).attr('height', HEIGHT).append('g').attr('transform',
              'translate(' + WIDTH / 2 + ', ' + HEIGHT / 2 + ')').selectAll('text').data(words).enter().append('text').style('font-size',
              function(d) {
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
          }).font('Lato').fontSize(function(d) {
            return fontSize(+d.value);
          }).text(function(d) {
            return d.key;
          }).on('end', draw).start();
        }

        function parseText(text) {
          tags = {};
          var cases = {};
          text.split(wordSeparators).forEach(function(word) {
            word.replace(/ /g, '');
            if (discard.test(word)) {
              return;
            }
            word = word.replace(WordCloudService.replace, '');
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
        }

        jQuery('.l-frame-media .container .wordcloud').html('');
        parseText(text);
      }

      // Render Visualisation
      function generateTextAndWordCloud() {
        if (angular.isDefined($scope.wordcloud.documents) && $scope.wordcloud.documents.length) {
          var text = '';
          angular.forEach($scope.wordcloud.documents, function(document) {
            text += document.text || '';
          });
          makeWordCloud(text);
        }
      }

      function applyStopWords() {
        if (angular.isDefined($scope.wordcloud.documents) && $scope.wordcloud.documents.length) {
          angular.forEach($scope.wordcloud.documents, function(document) {
            angular.forEach($scope.wordcloud.stopWords, function(stopword) {
              var re = new RegExp(stopword, 'gi');
              document.text = document.text.replace(re, '');
            });
          });
        }
      }

      $scope.$watchCollection('wordcloud.documents', function(documents) {
        if (angular.isDefined($scope.wordcloud.stopWords)) {
          applyStopWords();
        }
        if (angular.isDefined(documents)) {
          generateTextAndWordCloud();
        }
      });

      $scope.$watchCollection('wordcloud.stopWords', function(stopWords) {
        if (angular.isDefined(stopWords)) {
          applyStopWords();
          generateTextAndWordCloud();
        }
      });
    });