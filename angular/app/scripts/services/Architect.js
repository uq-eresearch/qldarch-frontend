'use strict';

angular.module('angularApp')
    .factory('Architect', function (Entity, GraphHelper, Expression, Uris) {
        // Service logic
        // ...

        var that = this;

        // Public API here
        return {
            /**
             * Finds an Architect by 'name'
             * @param name
             * @returns {Promise| Object} All architects that match
             */
            findByName: function (name) {
                return Entity.findByName(name, 'qldarch:Architect');
            },

            /**
             * Loads a single Architect
             * @param uri
             * @returns {Promise | Object}
             */
            load: function (uri, summary) {
                console.log("loading architect");
                return Entity.load(uri, summary);
            },

            /**
             * Loads all the entities of a certain type
             * @returns {Promise | Object} All architects
             */
            loadAll: function (summary) {
                if (!angular.isDefined(summary)) {
                    summary = true;
                }
                return Entity.loadAll('qldarch:Architect', summary);
            },

            /**
             * Loads a list of entities
             * @param uris
             * @returns {Promise| Object} All architects with uris
             */
            loadList: function (uris) {
                console.log('loading architects');
                return Entity.loadList(uris, false);
            }
        };
    });