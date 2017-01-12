'use strict';

angular.module('qldarchApp').config(
    function($stateProvider) {
      $stateProvider.state('others', {
        url : '/others',
        templateUrl : 'views/other/others.html',
        resolve : {
          others : [
              'Entity',
              'Uris',
              'GraphHelper',
              function(Entity, Uris, GraphHelper) {
                return Entity.loadAllIncSubclass('qldarch:NonDigitalThing', true).then(
                    function(entities) {
                      var results = [];
                      angular.forEach(entities, function(entity) {
                        var types = GraphHelper.asArray(entity[Uris.RDF_TYPE]);
                        if (types.indexOf(Uris.QA_ARCHITECT_TYPE) === -1 && types.indexOf(Uris.QA_FIRM_TYPE) === -1 &&
                            types.indexOf(Uris.QA_STRUCTURE_TYPE) === -1 && types.indexOf(Uris.QA_BUILDING_TYPOLOGY) === -1) {
                          results.push(entity);
                        }
                      });
                      return results;
                    });
              } ]
        },
        controller : 'OthersCtrl'
      });
    });