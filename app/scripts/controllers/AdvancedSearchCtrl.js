'use strict';

angular
    .module('qldarchApp')
    .controller(
        'AdvancedSearchCtrl',
        function($scope, $location, buildingTypologies, ArchObjTypes, MediaTypes) {

          $scope.categorySelect = {
            placeholder : 'Select category',
            dropdownAutoWidth : false,
            multiple : true,
            initSelection : true,// https://github.com/angular-ui/ui-select2/issues/153
            data : {
              results : [ {
                id : 'archobj',
                text : 'Archive Object'
              }, {
                id : 'media',
                text : 'Media'
              } ]
            }
          };

          var archobjtypes = {
            results : []
          };

          for ( var type in ArchObjTypes) {
            archobjtypes.results.push({
              id : type,
              text : ArchObjTypes[type]
            });
          }

          $scope.archobjtypeSelect = {
            placeholder : 'Select archive object type',
            dropdownAutoWidth : false,
            multiple : true,
            initSelection : true,
            data : archobjtypes
          };

          var mediatypes = {
            results : []
          };

          for ( var mtype in MediaTypes) {
            mediatypes.results.push({
              id : mtype,
              text : MediaTypes[mtype]
            });
          }

          $scope.mediatypeSelect = {
            placeholder : 'Select media type',
            dropdownAutoWidth : false,
            multiple : true,
            initSelection : true,
            data : mediatypes
          };

          var typologies = {
            results : []
          };

          for ( var typology in buildingTypologies) {
            typologies.results.push({
              id : typology,
              text : buildingTypologies[typology]
            });
          }

          $scope.typologySelect = {
            placeholder : 'Select building typology',
            dropdownAutoWidth : true,
            multiple : true,
            initSelection : true,
            data : typologies
          };

          $scope.architectSelect = {
            placeholder : 'Select architect, non-architect',
            dropdownAutoWidth : false,
            multiple : true,
            initSelection : true,
            data : {
              results : [ {
                id : 'true',
                text : 'Architect'
              }, {
                id : 'false',
                text : 'Non-architect'
              } ]
            }
          };

          function extractId(selected) {
            var id = [];
            angular.forEach(selected, function(s) {
              id.push(s.id);
            });
            return id;
          }

          function extractText(selected) {
            var text = [];
            angular.forEach(selected, function(s) {
              text.push(s.text);
            });
            return text;
          }

          $scope.advSearch = function(global, options) {
            var fields;
            var fieldquery = '';
            var and = ' AND ';
            var or = ' OR ';
            if (angular.isDefined(options)) {
              if (angular.isDefined(options.label)) {
                fieldquery = fieldquery + and + '(label:' + options.label + '*)';
              }
              if (angular.isDefined(options.category)) {
                if (options.category.length > 0) {
                  fieldquery = fieldquery + and + '(';
                  var i = 0;
                  angular.forEach(extractId(options.category), function(id) {
                    if (i === 0) {
                      fieldquery = fieldquery + 'category:' + id;
                    } else {
                      fieldquery = fieldquery + or + 'category:' + id;
                    }
                    i++;
                  });
                  fieldquery = fieldquery + ')';
                }
              }
              if (angular.isDefined(options.summary)) {
                fieldquery = fieldquery + and + '(summary:' + options.summary + '*)';
              }
              if (angular.isDefined(options.description)) {
                fieldquery = fieldquery + and + '(description:' + options.description + '*)';
              }
              if (angular.isDefined(options.archobjtype) || angular.isDefined(options.mediatype)) {
                var j = 0;
                var tobeclosed = false;
                if (angular.isDefined(options.archobjtype)) {
                  if (options.archobjtype.length > 0) {
                    angular.forEach(extractId(options.archobjtype), function(id) {
                      if (j === 0) {
                        fieldquery = fieldquery + and + '(type:' + id;
                        tobeclosed = true;
                      } else {
                        fieldquery = fieldquery + or + 'type:' + id;
                      }
                      j++;
                    });
                  }
                }
                if (angular.isDefined(options.mediatype)) {
                  if (options.mediatype.length > 0) {
                    angular.forEach(extractId(options.mediatype), function(id) {
                      if (j === 0) {
                        fieldquery = fieldquery + and + '(type:' + id;
                        tobeclosed = true;
                      } else {
                        fieldquery = fieldquery + or + 'type:' + id;
                      }
                      j++;
                    });
                  }
                }
                if (tobeclosed) {
                  fieldquery = fieldquery + ')';
                }
              }
              if (angular.isDefined(options.typology)) {
                if (options.typology.length > 0) {
                  fieldquery = fieldquery + and + '(';
                  var k = 0;
                  angular.forEach(extractText(options.typology), function(text) {
                    if (k === 0) {
                      fieldquery = fieldquery + 'typologies:"' + text + '"';
                    } else {
                      fieldquery = fieldquery + or + 'typologies:"' + text + '"';
                    }
                    k++;
                  });
                  fieldquery = fieldquery + ')';
                }
              }
            }
            if (angular.isDefined(options.architect)) {
              if (options.architect.length > 0) {
                fieldquery = fieldquery + and + '(';
                var l = 0;
                angular.forEach(extractId(options.architect), function(id) {
                  if (l === 0) {
                    fieldquery = fieldquery + 'architect:' + id;
                  } else {
                    fieldquery = fieldquery + or + 'architect:' + id;
                  }
                  l++;
                });
                fieldquery = fieldquery + ')';
              }
            }
            if (fieldquery.length > 5) {
              if (angular.isUndefined(global)) {
                fields = fieldquery.substr(5);
              } else {
                fields = fieldquery;
              }
            }
            if (angular.isDefined(global) || angular.isDefined(fields)) {
              $location.search({});
              $location.path('/search');
              $location.search({
                'query' : global,
                'fieldquery' : fields
              });
            } else {
              $scope.options = undefined;
            }
          };

          $scope.isValid = function isValid() {
            if (angular.isUndefined($scope.options)) {
              return ($scope.global || $scope.options || undefined) !== undefined;
            } else {
              return ($scope.global || $scope.options.label || $scope.options.category || $scope.options.summary || $scope.options.architect ||
                  $scope.options.description || $scope.options.archobjtype || $scope.options.mediatype || $scope.options.typology || undefined) !== undefined;
            }
          };
        });