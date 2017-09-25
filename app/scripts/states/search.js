'use strict';

angular.module('qldarchApp').config(
    function($stateProvider) {
      $stateProvider.state('search', {
        url : '/search?query',
        templateUrl : 'views/search.html',
        resolve : {
          architects : [ 'AggArchObjs', 'GraphHelper', '$filter', function(AggArchObjs, GraphHelper, $filter) {
            return AggArchObjs.loadArchitects().then(function(data) {
              var architects = GraphHelper.graphValues(data);
              return $filter('filter')(architects, function(architect) {
                return architect.label && !(/\s/.test(architect.label.substring(0, 1)));
              });
            }).catch(function() {
              console.log('unable to load all architects');
              return {};
            });
          } ],
          firms : [ 'AggArchObjs', '$filter', function(AggArchObjs, $filter) {
            return AggArchObjs.loadFirms().then(function(data) {
              return $filter('filter')(data, function(firm) {
                return firm.label && !(/\s/.test(firm.label.substring(0, 1)));
              });
            }).catch(function() {
              console.log('unable to load all firms');
              return {};
            });
          } ],
          structures : [ 'AggArchObjs', function(AggArchObjs) {
            return AggArchObjs.loadProjects().then(function(data) {
              return data;
            }).catch(function() {
              console.log('unable to load all projects');
              return {};
            });
          } ],
          personnotarchitect : [ 'AggArchObjs', function(AggArchObjs) {
            return AggArchObjs.loadPersonNotArchitect().then(function(data) {
              return data;
            }).catch(function() {
              console.log('unable to load person non-architect');
              return {};
            });
          } ],
          othersnotperson : [ 'AggArchObjs', function(AggArchObjs) {
            return AggArchObjs.loadOthersNotPerson().then(function(data) {
              return data;
            }).catch(function() {
              console.log('unable to load others non-person');
              return {};
            });
          } ],
          searchresult : [
              '$location',
              '$http',
              'Uris',
              'WordService',
              'architects',
              'firms',
              'structures',
              'personnotarchitect',
              'othersnotperson',
              '$filter',
              function($location, $http, Uris, WordService, architects, firms, structures, personnotarchitect, othersnotperson, $filter) {
                var query = $location.search().query;
                var q = (query).replace(WordService.spclCharsLucene, '');
                var url = Uris.WS_ROOT + 'search?q=' + q + '*&p=0';
                return $http.get(url + '&pc=0').then(
                    function(resp) {
                      return $http.get(url + '&pc=' + resp.data.hits).then(
                          function(response) {
                            var docs = response.data.documents;
                            var architects = $filter('filter')(docs, function(result) {
                              return result.architect === true;
                            });
                            var firms = $filter('filter')(docs, function(result) {
                              return result.type === 'firm';
                            });
                            var structures = $filter('filter')(docs, function(result) {
                              return result.type === 'structure';
                            });
                            var interviews = $filter('filter')(docs, function(result) {
                              return result.type === 'interview';
                            });
                            var articles = $filter('filter')(docs, function(result) {
                              return result.type === 'article' || result.type === 'Article';
                            });
                            var others = $filter('filter')(
                                docs,
                                function(result) {
                                  return result.architect !== true && result.type !== 'firm' && result.type !== 'structure' &&
                                      result.type !== 'interview' && result.type !== 'article' && result.type !== 'Article';
                                });
                            var data = architects.concat(firms, structures, interviews, articles, others);
                            /* globals $:false */
                            $.each(data, function(i, item) {
                              var path;
                              if (item.type === 'person' && item.architect === true) {
                                path = '/architect/summary?architectId=';
                                angular.forEach(architects, function(architect) {
                                  if (item.id === architect.id) {
                                    if (angular.isDefined(architect.media)) {
                                      data[i].media = architect.media;
                                    }
                                  }
                                });
                              } else if (item.type === 'person' && item.architect === false) {
                                path = '/other/summary?otherId=';
                                angular.forEach(personnotarchitect, function(person) {
                                  if (item.id === person.id) {
                                    if (angular.isDefined(person.media)) {
                                      data[i].media = person.media;
                                    }
                                  }
                                });
                              } else if (item.type === 'firm') {
                                path = '/firm/summary?firmId=';
                                angular.forEach(firms, function(firm) {
                                  if (item.id === firm.id) {
                                    if (angular.isDefined(firm.media)) {
                                      data[i].media = firm.media;
                                    }
                                  }
                                });
                              } else if (item.type === 'structure') {
                                path = '/project/summary?structureId=';
                                angular.forEach(structures, function(structure) {
                                  if (item.id === structure.id) {
                                    if (angular.isDefined(structure.media)) {
                                      data[i].media = structure.media;
                                    }
                                  }
                                });
                              } else if (item.type === 'article') {
                                path = '/article?articleId=';
                              } else if (item.category === 'media') {
                                path = '/media/download/';
                              } else if (item.type === 'interview') {
                                path = '/interview/';
                              } else {
                                path = '/other/summary?otherId=';
                                angular.forEach(othersnotperson, function(other) {
                                  if (item.id === other.id) {
                                    if (angular.isDefined(other.media)) {
                                      data[i].media = other.media;
                                    }
                                  }
                                });
                              }
                              data[i].link = path + item.id;
                            });
                            return {
                              query : q,
                              totalItems : resp.data.hits,
                              data : data
                            };
                          });
                    });

              } ]
        },
        controller : 'SearchCtrl'
      });
    });