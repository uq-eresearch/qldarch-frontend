'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('user.files.documents', {
    url : '/documents',
    resolve : {
      expressions : [ 'Expression', 'Auth', 'GraphHelper', 'Uris', '$filter', function(Expression, Auth, GraphHelper, Uris, $filter) {
        return Auth.status().then(function() {
          return Expression.findByUser(Auth.user).then(function(expressions) {
            console.log('documents', expressions);
            return $filter('filter')(expressions, function(expression) {
              return GraphHelper.asArray(expression[Uris.RDF_TYPE]).indexOf(Uris.QA_ARTICLE_TYPE) !== -1;
            });
          });
        });
      } ],
    },
    controller : 'UserFilesDocumentsCtrl',
    templateUrl : 'views/user.files.documents.html'
  });
});