'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('user.files.interviews', {
    url : '/interviews',
    resolve : {
      expressions : [ 'Expression', 'Auth', 'GraphHelper', 'Uris', '$filter', function(Expression, Auth, GraphHelper, Uris, $filter) {
        return Auth.status().then(function() {
          return Expression.findByUser(Auth.user).then(function(expressions) {
            // Filter out and only show the interviews
            return $filter('filter')(expressions, function(expression) {
              return GraphHelper.asArray(expression[Uris.RDF_TYPE]).indexOf(Uris.QA_INTERVIEW_TYPE) !== -1;
            });
          });
        });
      } ],
    },
    controller : 'UserFilesInterviewsCtrl',
    templateUrl : 'views/user.files.interviews.html'
  });
});