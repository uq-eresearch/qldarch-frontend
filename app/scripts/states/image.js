'use strict';

angular.module('qldarchApp').config(
    function($stateProvider) {
      $stateProvider.state('image', {
        abstract : true,
        url : '/image/:imageId',
        resolve : {
          image : [ 'Expression', 'GraphHelper', '$stateParams', function(Expression, GraphHelper, $stateParams) {
            console.log('resolving');
            var imageUri = GraphHelper.decodeUriString($stateParams.imageId);
            return Expression.load(imageUri);
          } ],
          depicts : [ 'Expression', 'Entity', 'GraphHelper', '$stateParams', 'Uris', function(Expression, Entity, GraphHelper, $stateParams, Uris) {
            var imageUri = GraphHelper.decodeUriString($stateParams.imageId);
            return Expression.load(imageUri).then(function(expression) {
              console.log('expression', expression);
              if (expression[Uris.QA_DEPICTS_BUILDING]) {
                return Entity.load(expression[Uris.QA_DEPICTS_BUILDING]);
              }
              if (expression[Uris.QA_RELATED_TO]) {
                return Entity.load(GraphHelper.asArray(expression[Uris.QA_RELATED_TO])[0]);
              }
              if (expression[Uris.QA_DEPICTS_ARCHITECT]) {
                return Entity.load(expression[Uris.QA_DEPICTS_ARCHITECT]);
              }
              if (expression[Uris.QA_DEPICTS_FIRM]) {
                return Entity.load(expression[Uris.QA_DEPICTS_FIRM]);
              }
              return [];
            });

          } ],
          images : [
              'Expression',
              'GraphHelper',
              '$stateParams',
              'Uris',
              function(Expression, GraphHelper, $stateParams, Uris) {
                var imageUri = GraphHelper.decodeUriString($stateParams.imageId);
                return Expression.load(imageUri).then(
                    function(expression) {
                      var type;
                      if (GraphHelper.asArray(expression[Uris.RDF_TYPE]).indexOf(Uris.QA_PHOTOGRAPH_TYPE) !== -1 ||
                          GraphHelper.asArray(expression[Uris.RDF_TYPE]).indexOf(Uris.QA_PORTRAIT_TYPE !== -1)) {
                        type = 'qldarch:Photograph';
                      }
                      if (GraphHelper.asArray(expression[Uris.RDF_TYPE]).indexOf(Uris.QA_LINEDRAWING_TYPE) !== -1) {
                        type = 'qldarch:LineDrawing';
                      }
                      console.log('type', type);
                      if (expression[Uris.QA_DEPICTS_BUILDING]) {
                        return Expression.findByBuildingUris([ expression[Uris.QA_DEPICTS_BUILDING] ], type).then(function(expressions) {
                          console.log('building expressions', expressions);
                          return expressions;
                        });
                      } else if (expression[Uris.QA_RELATED_TO]) {
                        return Expression.findByArchitectUris(GraphHelper.asArray(expression[Uris.QA_RELATED_TO]), type).then(function(expressions) {
                          console.log('architect expressions', expressions);
                          return expressions;
                        });
                      } else if (expression[Uris.QA_DEPICTS_ARCHITECT]) {
                        return Expression.findByArchitectUris(GraphHelper.asArray(expression[Uris.QA_DEPICTS_ARCHITECT]), type).then(
                            function(expressions) {
                              console.log('architect expressions', expressions);
                              return expressions;
                            });
                      } else if (expression[Uris.QA_DEPICTS_FIRM]) {
                        return Expression.findByFirmUris(GraphHelper.asArray(expression[Uris.QA_DEPICTS_FIRM]), type).then(function(expressions) {
                          console.log('firm expressions', expressions);
                          return expressions;
                        });
                      } else {
                        return [];
                      }
                    });

              } ]
        },
        controller : 'ImageCtrl',
        template : '<ui-view autoscroll="false"></ui-view>'
      });
    });