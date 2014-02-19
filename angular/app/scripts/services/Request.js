'use strict';

angular.module('angularApp')
    .factory('Request', function Request(Uris, $http, $q, GraphHelper) {
        // AngularJS will instantiate a singleton by calling "new" on this function

        var request = {
            http: function (url, params, cache) {
                var paramString = "";
                angular.forEach(params, function (param, key) {
                    paramString += key + "=";
                    if (angular.isArray(param)) {
                        // its an array, use comma separated value
                        angular.forEach(param, function (paramPart, index) {
                            paramString += encodeURIComponent(paramPart);
                            if (index != param.length - 1) {
                                paramString += ",";
                            }
                        })
                    } else {
                        paramString += encodeURIComponent(param);
                    }
                    paramString += "&";
                });
                var urlString = url;
                if (paramString.length) {
                    urlString += "?" + paramString;
                }
                return $http.get(urlString, {
                    cache: cache
                }).then(function (response) {
                    return GraphHelper.encodeUris(response.data);
                });
            },

            getUri: function (resource, uri, summary) {
                return request.getIndexForUris(resource, [uri], summary).then(function (items) {
                    return GraphHelper.encodeUri(items[uri]);
                })
            },
            /**
             *
             * @param resource e.g. qldarch:Architect
             * @param type e.g. entity, expression
             * @param summary true or false
             * @param subclass true or false
             * @returns {*}
             */
            getIndex: function (resource, type, summary, subclass) {
                // Setup summary text
                var summaryText = 'summary';
                if (summary) {
                    summaryText = 'summary';
                } else {
                    summaryText = 'detail';
                }
                // Setup subclass stuff
                var subclassText = 'false';
                if (subclass) {
                    subclassText = 'true';
                } else {
                    subclassText = 'false';
                }

                return request.http(Uris.JSON_ROOT + resource + '/' + summaryText + '/' + encodeURIComponent(type), {
                    'INCSUBCLASS': subclassText
                }, true).then(function (data) {
                    return GraphHelper.encodeUris(data);
                });
                //				return $http.get(Uris.JSON_ROOT + resource + "/" + summaryText + "/" + encodeURIComponent(type) + "?INCSUBCLASS=" + subclassText, {cache: true}).then(function (response) {
                //					return GraphHelper.encodeUris(response.data);
                //				});
            },
            /**
             * Get the graphs matching the provided urls
             * @param resource          The type of resource e.g. entity, expression, file, annotation/evidence
             * @param {Array}uris              An array of uris
             * @param {Boolean}summary
             * @returns {Promise|*}
             */
            getIndexForUris: function (resource, uris, summary) {
                // We need to get descriptions of all the entities now
                // but split it up into a few requests, so the server doesnt cry
                // about getting a url thats 10,000 characters long
                // lets do [[perRequest]] number at a time
                var requests = [];
                var perRequest = 50;
                // Build up the url

                var detailLevel = "description";
                if (resource == "file") {
                    // Special case, thanks AM!
                    detailLevel = "summary";
                }
                var requestUrl;
                if (resource == "annotation/evidence") {
                    requestUrl = Uris.JSON_ROOT + resource + '/' + '?IDLIST=';
                } else {
                    requestUrl = Uris.JSON_ROOT + resource + '/' + detailLevel + '?SUMMARY=' + summary + '&IDLIST=';
                }

                var idList = "";

                angular.forEach(uris, function (entity, index) {

                    idList += encodeURIComponent(entity);
                    if (index != uris.length - 1 || index % perRequest) {
                        idList += ",";
                    }

                    // do X requests at a time, or, stop if we are at the end
                    if ((index + 1) % perRequest == 0 || index == uris.length - 1) {
                        // We hit the limit (or the end), send it off
                        var request = $http.get(requestUrl + idList, {
                            cache: true
                        });
                        idList = "";
                        requests.push(request);
                    }
                });

                // Wait for all the description queries to finish
                return $q.all(requests).then(function (responses) {

                    // Join up all the description responses
                    var results = {};
                    angular.forEach(responses, function (response) {
                        angular.extend(results, response.data);
                    });

                    return GraphHelper.encodeUris(results);
                });
            }
        };

        return request;
    });