'use strict';


angular.module('angularApp')
    .factory('Solr', function (Entity, GraphHelper, Expression, Uris, $q, $http, $filter, ENV) {

        function createArticleResultFromDoc(doc) {
            var result = {};
            // Store the encodedUri
            result.title = doc.title[0];
            result.uri = doc.id;
            result.encodedUri = btoa(doc.id);
            result.type = 'article';
            result.text = doc.article;
            return result;
        }

        function createScore(text, query, separator) {

            var indexes = indexesOf(text, query.split(separator));
            var score = indexes.length;

            // Adjust rankings based on whole query occuring
            var patt = new RegExp(query, 'gi');
            var fullMatches = text.match(patt);
            if (fullMatches) {
                score += 5 * fullMatches.length;
            }
            return score;
        }

        /**
         * Generates a text snippet from a block of text, based on an array of terms
         * @param  {String} text		The text to create the snippet from
         * @param  {Array}  terms		An array of terms to look for in the text
         * @return {String}
         */
        function createSnippet(text, terms) {
            var ranges = [];
            var BACK_LENGTH = 10;
            var FORWARD_LENGTH = 50;
            var indexes = indexesOf(text, terms);
            angular.forEach(indexes, function (index) {
                var found = false;
                angular.forEach(ranges, function (range) {
                    if (range.start <= index && index <= range.end) {
                        found = true;
                        range.start = Math.min(index - BACK_LENGTH, range.start);
                        range.end = Math.max(index + FORWARD_LENGTH, range.end);
                        // Probably need to recompute the ranges here
                    }
                });
                if (!found) {
                    // stuff
                    var newRange = {
                        start: index - BACK_LENGTH,
                        end: index + FORWARD_LENGTH
                    };
                    ranges.push(newRange);
                }
            });

            // Create the snippet
            var snippet = '';
            angular.forEach(ranges, function (range) {
                snippet += text.substring(Math.max(0, range.start), Math.min(range.end, text.length)) + ' ... ';
            });

            return highlight(snippet, terms);
        }

        function indexesOf(text, terms) {
            var indexes = [];
            var indexFrom = 0;
            angular.forEach(terms, function (term) {
                var indexOf = text.toLowerCase().indexOf(term.toLowerCase(), indexFrom);
                while (indexOf !== -1) {
                    indexes.push(indexOf);
                    indexFrom = indexOf + term.length;
                    indexOf = text.toLowerCase().indexOf(term.toLowerCase(), indexFrom);
                }
            });

            return indexes;
        }

        function highlight(text, terms) {
            // Highlight the terms
            angular.forEach(terms, function (term) {
                var patt = new RegExp(term, 'gi');
                text = text.replace(patt, function (match) {
                    return '<span class="highlight">' + match + '</span>';
                });
            });

            return text;
        }

        // Public API here
        return {

            query: function (args) {

                var defaults = {
                    query: '',
                    type: '',
                };
                args = angular.extend({}, defaults, args);


                if (!args.query) {
                    return $q.reject('No query');
                }

                // @todo make this work for actual solr
                var urlTerms = '';
                if (args.type !== '') {
                    // Add the type to the query
                    angular.forEach(args.query.split(' '), function (term) {
                        urlTerms += args.type + ':' + term + ' ';
                    });
                } else {
                    urlTerms = args.query;
                }

                // this.SOLR_ROOT = '/solr/collection1/';
                // http://qldarch-test.metadata.net/solr/collection1/select?q=article%3Agraham%20article%3Abligh&wt=json&rows=100

                var url = Uris.SOLR_ROOT + 'select?wt=json&rows=100&q=' + encodeURIComponent(urlTerms);
                if (ENV.name === 'development') {
                    url = 'scripts/searchresults.json';
                }

                return $http.get(url).then(function (response) {

                    // We need to go through all the results
                    // And put in a title, and a url that it links to
                    // We need to merge interview results 
                    // since they are indexed by utterance instead of whole interview
                    var results = [];
                    var interviewUris = [];

                    // Create the results
                    angular.forEach(response.data.response.docs, function (doc) {
                        var result;

                        // Interview
                        if (angular.isDefined(doc.interview)) {
                            // check that we dont have it already
                            var found = false;
                            angular.forEach(results, function (storedResult) {
                                if (storedResult.uri === doc.interview) {
                                    // Add this exchange to the results text (will snippet later)
                                    result = storedResult;
                                    result.text += ' ' + doc.transcript;
                                    found = true;
                                }
                            });
                            if (!found) {
                                // Create a new result
                                result = {};
                                result.text = doc.transcript;
                                results.push(result);
                                interviewUris.push(doc.interview);
                            }

                            // Store the encodedUri
                            result.uri = doc.interview;
                            result.encodedUri = btoa(doc.interview);
                            result.type = 'interview';

                        } else if (angular.isDefined(doc.article)) {
                            // Its an article, a lot simpler
                            result = createArticleResultFromDoc(doc);
                            results.push(result);
                        }

                        // Create the text snippet
                        result.snippet = createSnippet(result.text, args.query.split(' '));

                        // Calculate the ranking based on terms
                        result.score = createScore(result.text, args.query, ' ');
                    });

                    // Get the titles of the interviews (since they dont come with any ARGH!)
                    return Expression.loadList(interviewUris, 'qldarch:Interview').then(function (expressions) {
                        angular.forEach(results, function (result) {
                            if (result.type === 'interview') {
                                result.title = expressions[result.uri][Uris.DCT_TITLE];
                            }
                        });
                        return $filter('orderBy')(results, '-score');
                    });
                });
            }


        };
    });