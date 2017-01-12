'use strict';

angular.module('qldarchApp').config(
    function($stateProvider) {
      $stateProvider.state('user.files.images', {
        url : '/images',
        resolve : {
          expressions : [
              'Expression',
              'Auth',
              'GraphHelper',
              'Uris',
              '$filter',
              function(Expression, Auth, GraphHelper, Uris, $filter) {
                return Auth.status().then(
                    function() {
                      return Expression.findByUser(Auth.user).then(
                          function(expressions) {
                            return $filter('filter')(
                                expressions,
                                function(expression) {
                                  return GraphHelper.asArray(expression[Uris.RDF_TYPE]).indexOf(Uris.QA_PHOTOGRAPH_TYPE) !== -1 ||
                                      GraphHelper.asArray(expression[Uris.RDF_TYPE]).indexOf(Uris.QA_LINEDRAWING_TYPE) !== -1;
                                });
                          });
                    });
              } ],
        },
        controller : 'UserFilesCtrl',
        templateUrl : 'views/user.files.images.html'
      });
    });