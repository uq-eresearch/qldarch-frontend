'use strict';

angular.module('qldarchApp').factory('Firm', function(Entity) {

  // Public API here
  return {
    /**
     * Finds an Architect by 'name'
     * 
     * @param name
     * @returns {Promise| Object} All architects that match
     */
    findByName : function(name) {
      return Entity.findByName(name, true, 'qldarch:Firm');
    },

    /**
     * Loads a single Architect
     * 
     * @param uri
     * @returns {Promise | Object}
     */
    load : function(uri, summary) {
      return Entity.load(uri, summary).then(function(firm) {
        var precededByFirmsUris = firm['http://qldarch.net/ns/rdf/2012-06/terms#precededByFirm'];
        if (angular.isDefined(precededByFirmsUris)) {
          var precededByFirmsUrisArray = [];
          if (angular.isArray(precededByFirmsUris)) {
            precededByFirmsUrisArray = precededByFirmsUris;
          } else {
            precededByFirmsUrisArray = [ precededByFirmsUris ];
          }
          Entity.loadList(precededByFirmsUrisArray).then(function(precededByFirms) {
            var results = [];
            angular.forEach(precededByFirms, function(graph) {
              results.push(graph);
            });
            firm.$precededByFirms = results;
          });
        }

        var succeededByFirmsUris = firm['http://qldarch.net/ns/rdf/2012-06/terms#succeededByFirm'];
        if (angular.isDefined(succeededByFirmsUris)) {
          var succeededByFirmsUrisArray = [];
          if (angular.isArray(succeededByFirmsUris)) {
            succeededByFirmsUrisArray = succeededByFirmsUris;
          } else {
            succeededByFirmsUrisArray = [ succeededByFirmsUris ];
          }
          Entity.loadList(succeededByFirmsUrisArray).then(function(succeededByFirms) {
            var results = [];
            angular.forEach(succeededByFirms, function(graph) {
              results.push(graph);
            });
            firm.$succeededByFirms = results;
          });
        }

        return firm;
      });
    },

    /**
     * Loads all the entities of a certain type
     * 
     * @returns {Promise | Object} All architects
     */
    loadAll : function(summary) {
      if (!angular.isDefined(summary)) {
        summary = true;
      }

      return Entity.loadAll('qldarch:Firm', summary);
    },

    /**
     * Loads a list of entities
     * 
     * @param uris
     * @returns {Promise| Object} All architects with uris
     */
    loadList : function(uris) {
      return Entity.loadList(uris, false);
    }
  };
});