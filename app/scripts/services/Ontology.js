'use strict';

angular.module('qldarchApp').factory('Ontology', function(Uris, Request, $filter, GraphHelper) {

  var ontology = {
    /**
     * Loads a single entity
     * 
     * @param uri
     * @returns {Promise | Summary object}
     */
    loadProperty : function(uri) {
      return Request.http(Uris.JSON_ROOT + 'ontology/properties', {}, true).then(function(properties) {
        return properties[uri];
      });
    },
    loadAllProperties : function() {
      return Request.http(Uris.JSON_ROOT + 'ontology/properties', {}, true).then(function(properties) {
        return properties;
      });
    },
    findPropertyByName : function(name) {
      return ontology.loadAllProperties().then(function(properties) {
        var results = [];
        angular.forEach(properties, function(property) {
          if (angular.isDefined(property[Uris.QA_ENTAILS_RELATIONSHIP])) {
            // its a relationship
            console.log('label', property[Uris.RDFS_LABEL]);
            var label = GraphHelper.asArray(property[Uris.RDFS_LABEL])[0];
            if (label.toLowerCase().indexOf(name.toLowerCase()) !== -1) {
              results.push(property);
              property.name = label;
            }
          }
        });
        return results;
      });
    },
    /**
     * Gets back all the entities that the user can set an entity to be e.g.
     * structure, academic, architect, etc
     * 
     * @return {[type]} [description]
     */
    loadAllEditableEntityTypes : function() {
      console.log('got to there?!!!');
      return Request.http(Uris.JSON_ROOT + 'ontology/entities/qldarch:Entity', {
        'INCSUBCLASS' : true
      }, true).then(function(entities) {
        return $filter('filter')(GraphHelper.graphValues(entities), function(entity) {
          return entity['http://qldarch.net/ns/rdf/2012-06/terms#editable'] === true;
        });
      });
    }
  };

  return ontology;
});