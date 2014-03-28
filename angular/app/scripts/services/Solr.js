'use strict';


angular.module('angularApp')
    .factory('Solr', function (Entity, GraphHelper, Expression, Uris, $q, $http, $filter) {

        function createScore(title, text, query, separator) {

            // Look at title
            var titleIndexes = indexesOf(title, [query]);
            var score = titleIndexes.length * 100;

            // Look at body text
            var textIndexes = indexesOf(text, query.split(separator));
            score += textIndexes.length;

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

        function getArticlesFromDocs(docs, query) {
            var articleUris = [],
                results = [];
            angular.forEach(docs, function (doc) {
                // Split out the interviews
                if (!angular.isDefined(doc.interview)) {
                    articleUris.push(doc.id);
                }
            });

            if (!articleUris.length) {
                return $q.when(results);
            }

            return Expression.loadList(articleUris, 'qldarch:Article', false).then(function (articles) {
                angular.forEach(docs, function (doc) {
                    if (angular.isDefined(doc.article)) {
                        var result = {};
                        result.uri = doc.id;
                        result.link = Uris.FILE_ROOT + doc['system_location'];
                        result.encodedUri = btoa(doc.id);
                        result.title = doc.title[0];
                        result.type = 'article';
                        result.text = doc.article;
                        result.periodicalTitle = articles[doc.id][Uris.QA_PERIODICAL_TITLE];
                        result.issue = articles[doc.id][Uris.QA_ISSUE];
                        result.pages = articles[doc.id][Uris.QA_PAGES];
                        result.description = articles[doc.id][Uris.DCT_DESCRIPTION];
                        result.volume = articles[doc.id][Uris.QA_VOLUME];
                        result.authors = articles[doc.id][Uris.QA_AUTHORS];
                        result.datePublished = articles[doc.id][Uris.QA_DATE_PUBLISHED];

                        // Create the text snippet
                        result.snippet = createSnippet(result.text, query.split(' ')).substring(0, 1000);

                        // // Calculate the ranking based on terms
                        result.score = createScore(result.title, result.text, query, ' ');
                        results.push(result);
                    }
                });
                return results;
            });
        }

        /**
         * Processes the solr results and makes them useful
         * @param  {[type]} docs  [description]
         * @param  {[type]} query [description]
         * @return {[type]}       [description]
         */
        function getInterviewsFromDocs(docs, query) {
            var interviewUris = [],
                results = [];
            angular.forEach(docs, function (doc) {
                // Split out the interviews
                if (angular.isDefined(doc.interview)) {
                    interviewUris.push(doc.interview);
                }
            });
            if (!interviewUris.length) {
                return $q.when(results);
            }

            return Expression.loadList(interviewUris, 'qldarch:Interview', false).then(function (interviews) {
                angular.forEach(docs, function (doc) {

                    if (angular.isDefined(doc.interview)) {
                        var result = {};
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
                            result.title = interviews[doc.interview][Uris.DCT_TITLE];
                            results.push(result);
                            result.uri = doc.interview;
                            result.encodedUri = btoa(doc.interview);
                            result.type = 'interview';
                            result.link = '#/interview/' + btoa(doc.interview);
                        }
                    }
                });

                angular.forEach(results, function (result) {
                    // Create the text snippet
                    result.snippet = createSnippet(result.text, query.split(' '));

                    // Calculate the ranking based on terms
                    result.score = createScore(result.title, result.text, query);
                });

                return results;
            });
        }

        // Public API here
        return {

            query: function (args) {

                var defaults = {
                    query: '',
                    type: '',
                    containFullQuery: false
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
                // if (ENV.name === 'development') {
                //     url = 'scripts/searchresults.json';
                // }

                return $http.get(url).then(function (response) {

                    // We need to go through all the results
                    // And put in a title, and a url that it links to
                    // We need to merge interview results 
                    // since they are indexed by utterance instead of whole interview

                    return getArticlesFromDocs(response.data.response.docs, args.query).then(function (articles) {
                        return getInterviewsFromDocs(response.data.response.docs, args.query).then(function (interviews) {
                            var results = articles.concat(interviews);
                            return $filter('orderBy')(results, '-score');
                            // return results;

                        });
                    });
                    // Create the results
                    // angular.forEach(response.data.response.docs, function (doc) {
                    //     // Split out the interviews
                    //     if (angular.isDefined(doc.interview)) {
                    //         interviewUris.push(doc.interview);
                    //     } else {
                    //         articleUris.push(doc.id);
                    //     }

                    // var result;



                    // // Interview
                    // if (angular.isDefined(doc.interview)) {
                    //     // check that we dont have it already
                    //     var found = false;
                    //     angular.forEach(results, function (storedResult) {
                    //         if (storedResult.uri === doc.interview) {
                    //             // Add this exchange to the results text (will snippet later)
                    //             result = storedResult;
                    //             result.text += ' ' + doc.transcript;
                    //             found = true;
                    //         }
                    //     });
                    //     if (!found) {
                    //         // Create a new result
                    //         result = {};
                    //         result.text = doc.transcript;
                    //         results.push(result);
                    //         interviewUris.push(doc.interview);
                    //     }

                    //     // Store the encodedUri
                    //     result.uri = doc.interview;
                    //     result.encodedUri = btoa(doc.interview);
                    //     result.type = 'interview';

                    // } else if (angular.isDefined(doc.article)) {
                    //     // Its an article, a lot simpler
                    //     result = createArticleResultFromDoc(doc);
                    //     results.push(result);
                    // }

                    // // Create the text snippet
                    // result.snippet = createSnippet(result.text, args.query.split(' '));

                    // // Calculate the ranking based on terms
                    // result.score = createScore(result.text, args.query, ' ');
                    // });

                    // if (interviewUris.length && articleUris.length) {
                    //     // Get the interviews titles before processing
                    //     return Expression.loadList(interviewUris, 'qldarch:Interview').then(function (interviews) {
                    //         angular.forEach(response.data.response.docs, function (doc) {
                    //             if (angular.isDefined(doc.interview)) {

                    //                 doc.title = interviews[doc.interview][Uris.DCT_TITLE];
                    //             }
                    //         });

                    //         return Expression.loadList(articleUris, 'qldarch:Article').then(function (articles) {
                    //             angular.forEach(response.data.response.docs, function (doc) {
                    //                 if (angular.isDefined(doc.interview)) {
                    //                     doc.title = articles[doc.id][Uris.QA_PERIODICAL_TITLE];
                    //                     doc.issue = articles[doc.id][Uris.QA_ISSUE];
                    //                     doc.pages = articles[doc.id][Uris.QA_PAGES];
                    //                     doc.description = articles[doc.id][Uris.DCT_DESCRIPTION];
                    //                     doc.volume = articles[doc.id][Uris.QA_VOLUME];
                    //                     doc.authors = articles[doc.id][Uris.QA_AUTHORS];
                    //                 }
                    //             });

                    //             return processDocs(response.data.response.docs, args.query);
                    //         });

                    //     });
                    // } else if () {
                    //     if
                    //     return processDocs(response.data.response.docs, args.query);
                    // }

                    // // Get the titles of the interviews (since they dont come with any ARGH!)
                    // return Expression.loadList(interviewUris, 'qldarch:Interview').then(function (expressions) {
                    //     angular.forEach(results, function (result) {
                    //         if (result.type === 'interview') {
                    //             result.title = expressions[result.uri][Uris.DCT_TITLE];
                    //         }
                    //     });
                    //     return $filter('orderBy')(results, '-score');
                    // });
                });
            }


        };
    });