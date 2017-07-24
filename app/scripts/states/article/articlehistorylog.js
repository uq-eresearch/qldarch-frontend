'use strict';

angular.module('qldarchApp').config(
    function($stateProvider) {
      $stateProvider.state('articlehistorylog', {
        url : '/articlehistorylog?articleId',
        templateUrl : 'views/articlehistorylog.html',
        resolve : {
          article : [ '$stateParams', 'ArchObj', function($stateParams, ArchObj) {
            return ArchObj.load($stateParams.articleId).then(function(data) {
              return data;
            });
          } ],
          users : [ 'Uris', '$http', function(Uris, $http) {
            // Gets all users in the system and their roles
            return $http.get(Uris.WS_ROOT + 'accounts/all').then(function(response) {
              return response.data;
            });
          } ],
          articlehstlog : [ '$stateParams', 'Uris', '$http', 'users', function($stateParams, Uris, $http, users) {
            /* globals $:false */
            var payload = {
              oid : $stateParams.articleId
            };
            return $http({
              method : 'POST',
              url : Uris.WS_ROOT + 'archobjversion',
              headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
              },
              withCredentials : true,
              transformRequest : function(obj) {
                return $.param(obj, true);
              },
              data : payload
            }).then(function(response) {
              angular.forEach(response.data, function(d) {
                angular.forEach(users, function(user) {
                  if (d.owner === user.id) {
                    d.username = user.username;
                    d.email = user.email;
                  }
                });
                var doc = JSON.parse(d.document);
                d.document = doc;
                delete d.document.id;
                delete d.document.created;
                delete d.document.type;
                delete d.document.label;
                if (angular.isDefined(d.document.authors)) {
                  d.document['Author(s)'] = d.document.authors;
                  delete d.document.authors;
                }
                if (angular.isDefined(d.document.periodical)) {
                  d.document['Periodical Title'] = d.document.periodical;
                  delete d.document.periodical;
                }
                if (angular.isDefined(d.document.volume)) {
                  d.document.Volume = d.document.volume;
                  delete d.document.volume;
                }
                if (angular.isDefined(d.document.issue)) {
                  d.document.Issue = d.document.issue;
                  delete d.document.issue;
                }
                if (angular.isDefined(d.document.pages)) {
                  d.document['Page(s)'] = d.document.pages;
                  delete d.document.pages;
                }
                if (angular.isDefined(d.document.published)) {
                  d.document['Publication Date'] = d.document.published;
                  delete d.document.published;
                }
                if (angular.isDefined(d.document.summary)) {
                  d.document.Summary = d.document.summary;
                  delete d.document.summary;
                }
              });
              return response.data;
            }, function(response) {
              console.log('error message: ' + response.data.msg);
            });
          } ]
        },
        controller : [ '$scope', 'articlehstlog', 'ObjectDiff', 'article', 'ArchObj', '$state',
            function($scope, articlehstlog, ObjectDiff, article, ArchObj, $state) {
              $scope.article = article;
              $scope.articleHistoryLog = articlehstlog;

              for (var i = 0; i < $scope.articleHistoryLog.length; i++) {
                var prev = i;
                var curr = i;
                if (i > 0) {
                  prev = i - 1;
                }
                ObjectDiff.setOpenChar('');
                ObjectDiff.setCloseChar('');
                var diff = ObjectDiff.diffOwnProperties($scope.articleHistoryLog[prev].document, $scope.articleHistoryLog[curr].document);
                $scope.articleHistoryLog[i].diffValue = ObjectDiff.toJsonView(diff);
                $scope.articleHistoryLog[i].diffValueChanges = ObjectDiff.toJsonDiffView(diff);
              }

              $scope.delete = function(article) {
                var r = window.confirm('Delete article ' + article.label + '?');
                if (r === true) {
                  ArchObj.delete(article.id).then(function() {
                    $state.go('articles');
                  });
                }
              };
            } ]
      });
    });