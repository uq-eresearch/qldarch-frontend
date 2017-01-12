'use strict';

angular.module('qldarchApp').controller('WordCloudBuilderCtrl',
    function($scope, compoundObject, Auth, $filter, Uris, SearchService, $state, Entity, CompoundObject) {

      /*
       * ===================================================== Setup
       * =====================================================
       */
      $scope.compoundObject = compoundObject.jsonData; // alias for convenience
      $scope.wordcloud = compoundObject.jsonData.data; // alias for convenience
      if (!compoundObject.uri) {
        $scope.wordcloud.documents = [];
        $scope.compoundObject.user = Auth;
        $scope.compoundObject.type = 'wordcloud';
        $scope.wordcloud.stopWords = [];
      }

      /*
       * ===================================================== Import Places
       * =====================================================
       */

      function calculateNumberToImport() {
        if ($scope.wordcloud.$import.documents) {
          var selected = $filter('filter')($scope.wordcloud.$import.documents, function(document) {
            return document.$selected;
          });
          selected = $filter('filter')(selected, function(document) {
            return !$scope.wordcloud.$import.type || document.type === $scope.wordcloud.$import.type;
          });
          $scope.wordcloud.$import.numberToImport = selected.length;
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
        // Clear the current locations
        $scope.wordcloud.$import.documents = null;

        // Do a search for documents
        SearchService.getArticlesInterviews(entity.name).then(function(documents) {
          // Got the documents
          $scope.wordcloud.$import.documents = documents;
          angular.forEach(documents, function(document) {
            document.$selected = true;
          });
          $scope.importSelectionChanged();
          console.log('documents', documents);
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
          console.log('documents', documents);
        });
      };

      /**
       * Adds a list of documents (if selected) to the word cloud visualisation
       * 
       * @param {[type]}
       *          documents [description]
       * @return {[type]} [description]
       */
      $scope.import = function(documents) {
        documents = $filter('filter')(documents, function(document) {
          return document.$selected;
        });
        documents = $filter('filter')(documents, function(document) {
          return !$scope.wordcloud.$import.type || document.type === $scope.wordcloud.$import.type;
        });

        $scope.wordcloud.documents = documents.concat($scope.wordcloud.documents);
        $scope.wordcloud.$import = {
          entity : null,
          documents : []
        };
        $state.go('ugc.wordcloud.edit');
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
        $state.go('ugc.wordcloud.edit');
      };

      /*
       * ===================================================== Delete Locations
       * =====================================================
       */
      $scope.remove = function(document) {
        var index = $scope.wordcloud.documents.indexOf(document);
        $scope.wordcloud.documents.splice(index, 1);
      };

      /*
       * ===================================================== Add stop word
       * =====================================================
       */
      $scope.addStopWord = function(word) {
        console.log('adding sotp worod');
        $scope.wordcloud.stopWords = $scope.wordcloud.stopWords || [];
        $scope.wordcloud.stopWords.push(word.toLowerCase());
        $scope.wordcloud.$stopWord = '';
        console.log($scope.wordcloud.stopWords);
      };
      $scope.removeStopWord = function(word) {
        var index = $scope.wordcloud.stopWords.indexOf(word);
        $scope.wordcloud.stopWords.splice(index, 1);
      };
      /*
       * ===================================================== Save Map
       * =====================================================
       */
      $scope.save = function() {
        if (!compoundObject.uri) {
          CompoundObject.store($scope.compoundObject).then(function(data) {
            $state.go('ugc.wordcloud', {
              id : data.encodedUri
            });
          });
        } else {
          CompoundObject.update(compoundObject.uri, $scope.compoundObject).then(function(data) {
            $state.go('ugc.wordcloud', {
              id : data.encodedUri
            });
          });
        }
      };

      /*
       * ===================================================== Select2 Boxes
       * =====================================================
       */
      function format(entity) {
        var imgSrc = 'images/icon.png';
        if (entity.picture) {
          imgSrc = Uris.THUMB_ROOT + entity.picture.thumb;
        }

        return '<img class="select2-thumb" src="' + imgSrc + '" />' + entity.text;
      }
      // Setup the entity select boxes
      $scope.architectStructureFirmTypologySelect = {
        placeholder : 'Architect, Project or Firm',
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