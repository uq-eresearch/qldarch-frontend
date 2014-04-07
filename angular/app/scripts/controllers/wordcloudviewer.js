'use strict';

angular.module('angularApp')
    .controller('WordCloudViewerCtrl', function ($scope, compoundObject, Auth, CompoundObject, $state) {
        $scope.compoundObject = compoundObject.jsonData;
        $scope.wordcloud = compoundObject.jsonData.data;


        $scope.isEditable = Auth.auth && ($scope.compoundObject.user.user === Auth.user || Auth.role === 'editor' || Auth.role === 'root');
        $scope.isDeletable = Auth.auth && ($scope.compoundObject.user.user === Auth.user || Auth.role === 'root');

        $scope.delete = function () {
            var r = window.confirm('Delete this word cloud?');
            if (r === true) {
                CompoundObject.delete(compoundObject.uri).then(function () {
                    $state.go('main');
                });
            }
        };

        /*
        =====================================================
            Render Visualisation
        =====================================================
         */
        $scope.$watchCollection('wordcloud.documents', function (documents) {
            console.log('documents', documents);
            if (documents && documents.length) {
                var text = '';
                angular.forEach($scope.wordcloud.documents, function (document) {
                    text += document.text || '';
                });
                console.log('text is', text);
                makeWordCloud(text);
            }
        });

        /*
        =====================================================
           	D3 Wordcloud
        =====================================================
         */

        function makeWordCloud(text) {
            var fill = d3.scale.category20();
            var WIDTH = 900;
            var HEIGHT = 600;

            var words = [],
                max,
                scale = 1,
                complete = 0,
                keyword = "",
                tags,
                fontSize,
                maxLength = 30,
                fetcher,
                statusText = d3.select('#status');

            var stopWords = /^(i|me|my|myself|we|us|our|ours|ourselves|you|your|yours|yourself|yourselves|he|him|his|himself|she|her|hers|herself|it|its|itself|they|them|their|theirs|themselves|what|which|who|whom|whose|this|that|these|those|am|is|are|was|were|be|been|being|have|has|had|having|do|does|did|doing|will|would|should|can|could|ought|i'm|you're|he's|she's|it's|we're|they're|i've|you've|we've|they've|i'd|you'd|he'd|she'd|we'd|they'd|i'll|you'll|he'll|she'll|we'll|they'll|isn't|aren't|wasn't|weren't|hasn't|haven't|hadn't|doesn't|don't|didn't|won't|wouldn't|shan't|shouldn't|can't|cannot|couldn't|mustn't|let's|that's|who's|what's|here's|there's|when's|where's|why's|how's|a|an|the|and|but|if|or|because|as|until|while|of|at|by|for|with|about|against|between|into|through|during|before|after|above|below|to|from|up|upon|down|in|out|on|off|over|under|again|further|then|once|here|there|when|where|why|how|all|any|both|each|few|more|most|other|some|such|no|nor|not|only|own|same|so|than|too|very|say|says|said|shall)$/,
                // punctuation = new RegExp('[\.,-\/#!$%\^&\*;:{}=\-_`~()]', 'g'),
                wordSeparators = /[\s\u3031-\u3035\u309b\u309c\u30a0\u30fc\uff70]+/g,
                discard = /^(@|https?:)/,
                htmlTags = /(<[^>]*?>|<script.*?<\/script>|<style.*?<\/style>|<head.*?><\/head>)/g,
                matchTwitter = /^https?:\/\/([^\.]*\.)?twitter\.com/;

            function parseText(text) {
                tags = {};
                var cases = {};
                text.split(wordSeparators).forEach(function (word) {
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
                tags = d3.entries(tags).sort(function (a, b) {
                    return b.value - a.value;
                });
                tags.forEach(function (d) {
                    d.key = cases[d.key];
                });
                generate(tags);
                // 
                console.log('tags', tags, 'cases', cases);
            }

            jQuery('.l-frame-media .container .wordcloud').html('');
            parseText(text);


            function draw(words) {
                d3.select('.l-frame-media .container .wordcloud').append('svg')
                    .attr('width', WIDTH)
                    .attr('height', HEIGHT)
                    .append('g')
                    .attr('transform', 'translate(' + WIDTH / 2 + ', ' + HEIGHT / 2 + ')')
                    .selectAll('text')
                    .data(words)
                    .enter().append('text')
                    .style('font-size', function (d) {
                        return d.size + 'px';
                    })
                    .style('font-family', 'Impact')
                    .style('fill', function (d, i) {
                        return fill(i);
                    })
                    .attr('text-anchor', 'middle')
                    .attr('transform', function (d) {
                        return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
                    })
                    .text(function (d) {
                        return d.text;
                    });
            }

            function generate(tags) {
                fontSize = d3.scale.log().range([10, 100]);

                d3.layout.cloud().size([WIDTH, HEIGHT])
                    .words(tags.slice(0, Math.min(tags.length, 250)))
                    .padding(5)
                    .rotate(function () {
                        return 0;
                        // return Math.floor((Math.random() * 2) * 90);
                    })
                    .font('Lato')
                    .fontSize(function (d) {
                        console.log('value is', d.value);
                        return fontSize(+d.value);
                    })
                    .text(function (d) {
                        return d.key;
                    })
                    .on('end', draw)
                    .start();
            }
        }
    });