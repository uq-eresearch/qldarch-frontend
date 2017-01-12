'use strict';

angular.module('qldarchApp').config(
    function($stateProvider) {
      $stateProvider.state('structure.photograph', {
        url : '/photograph/:photographId',
        templateUrl : 'views/photograph.html',
        resolve : {
          photograph : [ 'Expression', '$stateParams', 'GraphHelper', 'Uris', 'Structure',
              function(Expression, $stateParams, GraphHelper, Uris, Structure) {
                var photographUri = GraphHelper.decodeUriString($stateParams.photographId);
                return Expression.load(photographUri, 'qldarch:Photograph').then(function(photograph) {
                  // Loading building if its there
                  if (angular.isDefined(photograph[Uris.QA_DEPICTS_BUILDING])) {
                    return Structure.load(photograph[Uris.QA_DEPICTS_BUILDING]).then(function(structure) {
                      photograph.building = structure;
                      return photograph;
                    });
                  } else {
                    return photograph;
                  }
                });
              } ]
        },
        controller : 'PhotographCtrl'
      });
    });