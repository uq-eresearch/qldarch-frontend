'use strict';

angular.module('qldarchApp').controller('WordCloudBuilderCtrl',
    function($scope, compobj, entities, Auth, $filter, SearchService, $state, CompObj, ArchObj, WordService, $q, $http, Uris) {

      $scope.compoundObject = compobj;
      $scope.wordcloud = compobj;
      $scope.wordcloud.$import = null;
      if (!compobj.id) {
        $scope.wordcloud.documents = [];
        $scope.compoundObject.user = Auth.user;
        $scope.compoundObject.type = 'wordcloud';
        $scope.wordcloud.stopWords = [];
      }

      $scope.isWaiting = false;

      // Import Places
      function calculateNumberToImport() {
        if (angular.isDefined($scope.wordcloud.$import) && $scope.wordcloud.$import !== null) {
          if (angular.isDefined($scope.wordcloud.$import.documents)) {
            var selected = $filter('filter')($scope.wordcloud.$import.documents, function(document) {
              return document.$selected;
            });
            selected = $filter('filter')(selected, function(document) {
              return (!$scope.wordcloud.$import.type || document.type === $scope.wordcloud.$import.type);
            });
            $scope.wordcloud.$import.numberToImport = selected.length;
          }
        }
      }
      $scope.importSelectionChanged = function() {
        calculateNumberToImport();
      };
      $scope.$watch('wordcloud.$import.type', function() {
        calculateNumberToImport();
      });

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
        $scope.wordcloud.$import.isSearching = true;
        // Clear the current locations
        $scope.wordcloud.$import.documents = null;

        // Do a search for documents
        SearchService.getArticlesInterviews(entity.label).then(function(documents) {
          $scope.wordcloud.$import.isSearching = false;
          // Got the documents
          $scope.wordcloud.$import.documents = documents;
          angular.forEach(documents, function(document) {
            document.$selected = true;
          });
          $scope.importSelectionChanged();
        });
      });

      $scope.search = function(query) {
        $scope.wordcloud.$import.isSearching = true;
        if (!query.length) {
          return;
        }

        // Clear the current locations
        $scope.wordcloud.$import.documents = null;

        // Do a search for documents
        SearchService.getArticlesInterviews(query).then(function(documents) {
          $scope.wordcloud.$import.isSearching = false;
          // Got the documents
          $scope.wordcloud.$import.documents = documents;
          angular.forEach(documents, function(document) {
            document.$selected = true;
          });
          $scope.importSelectionChanged();
        });
      };

      function joinText(text) {
        var maxLength = 30;
        var words = '';
        text.split(WordService.wordSeparators).forEach(function(word) {
          word.replace(/ /g, '');
          if (WordService.discard.test(word)) {
            return;
          }
          word = word.replace(WordService.specialChars, '');
          if (WordService.stopWords.test(word.toLowerCase())) {
            return;
          }
          if (word.length >= 1) {
            words += word.substr(0, maxLength) + ' ';
          }
        });
        return words;
      }

      /**
       * Adds a list of documents (if selected) to the word cloud visualisation
       * 
       * @param {[type]}
       *          documents [description]
       * @return {[type]} [description]
       */
      $scope.import = function(documents) {
        $scope.isWaiting = true;
        documents = $filter('filter')(documents, function(document) {
          return document.$selected;
        });
        documents = $filter('filter')(documents, function(document) {
          return (!$scope.wordcloud.$import.type || document.type === $scope.wordcloud.$import.type);
        });
        var promises = [];
        angular.forEach(documents, function(document) {
          var promise;
          if (document.type === 'interview') {
            promise = ArchObj.load(document.id).then(function(data) {
              return data;
            }).catch(function(response) {
              console.log('unable to load interview ArchObj');
              return response;
            });
            promises.push(promise);
          }
          if (document.type === 'article') {
            promise = $http.get(Uris.WS_ROOT + 'media/text/' + document.id).then(function(result) {
              return result.data;
            }, function(response) {
              console.log('error message: ' + response.data.msg);
              return response.data;
            });
            promises.push(promise);
          }
        });
        $q.all(promises).then(function(data) {
          var i = 0;
          angular.forEach(data, function(d) {
            documents[i].text = '';
            if (documents[i].type === 'interview') {
              if (angular.isDefined(d.transcript)) {
                documents[i].title = documents[i].label;
                angular.forEach(d.transcript, function(t) {
                  documents[i].text += joinText(t.transcript);
                });
              }
            }
            if (documents[i].type === 'article') {
              if (angular.isDefined(d.text)) {
                documents[i].title = documents[i].label;
                documents[i].text += joinText(d.text);
              }
            }
            i++;
          });
          $scope.wordcloud.documents = documents.concat($scope.wordcloud.documents);
          $scope.wordcloud.$import = {
            entity : null,
            documents : []
          };
          $scope.isWaiting = false;
          $state.go('ugc.wordcloud.edit');
        });
      };

      // New
      $scope.addDocument = function(document) {
        $scope.isWaiting = true;
        // Store
        $scope.wordcloud.documents.unshift(document);
        // Clear the entry
        $scope.wordcloud.$tempDocument = {
          type : 'new'
        };
        $scope.isWaiting = false;
        $state.go('ugc.wordcloud.edit');
      };

      // Delete
      $scope.remove = function(document) {
        $scope.isWaiting = true;
        var index = $scope.wordcloud.documents.indexOf(document);
        $scope.wordcloud.documents.splice(index, 1);
        $scope.isWaiting = false;
      };

      $scope.removeAll = function() {
        $scope.wordcloud.documents = [];
      };

      // Add stop word
      $scope.addStopWord = function(word) {
        $scope.wordcloud.stopWords = $scope.wordcloud.stopWords || [];
        $scope.wordcloud.stopWords.push(word.toLowerCase());
        $scope.wordcloud.$stopWord = '';
      };
      $scope.removeStopWord = function(word) {
        var index = $scope.wordcloud.stopWords.indexOf(word);
        $scope.wordcloud.stopWords.splice(index, 1);
      };

      // Save Word Cloud
      $scope.save = function() {
        $scope.isWaiting = true;
        CompObj.create($scope.compoundObject).then(function(data) {
          $scope.isWaiting = false;
          $state.go('ugc.wordcloud', {
            id : data.id
          });
        });
      };

      // Select2 Boxes
      entities = $filter('orderBy')(entities, function(entity) {
        return entity.label;
      });

      var dataEntitySelectWordCloud = {
        results : []
      };

      angular.forEach(entities, function(e) {
        if (e.label && !(/\s/.test(e.label.substring(0, 1)))) {
          var entitytype = 'unknown';
          if (e.hasOwnProperty('type')) {
            entitytype = e.type.charAt(0).toUpperCase() + e.type.slice(1);
          } else if (e.hasOwnProperty('firstname') || e.hasOwnProperty('lastname')) {
            entitytype = 'Person';
          } else if (e.hasOwnProperty('lat') || e.hasOwnProperty('lng')) {
            entitytype = 'Structure';
          }
          dataEntitySelectWordCloud.results.push({
            id : e.id,
            text : e.label + ' (' + entitytype + ')',
            label : e.label,
            type : entitytype
          });
        }
      });

      // Setup the entity select boxes
      $scope.architectStructureFirmSelectWordCloud = {
        placeholder : 'Architect, Project or Firm',
        dropdownAutoWidth : false,
        multiple : false,
        initSelection : true,
        data : dataEntitySelectWordCloud
      };
    });