'use strict';

angular.module('qldarchApp').controller(
    'RelationshipCtrl',
    function($scope, data, relationships, subject, interviews, GraphHelper, $filter, $http, Uris, toaster, $state) {

      $scope.archobjId = data.id;
      $scope.archobjType = data.type;
      $scope.relationships = relationships;
      $scope.subject = subject;

      // Transform the data for d3
      var links = [];
      angular.forEach($scope.relationships, function(relationship) {
        if (relationship.subject && relationship.object) {
          // Do we have any relationships?
          var matchedLinks = $filter('filter')(
              links,
              function(link) {
                if ((link.source.id === relationship.subject && link.target.id === relationship.object) ||
                    (link.target.id === relationship.subject && link.source.id === relationship.object)) {
                  return true;
                }
              });
          if (matchedLinks.length === 0) {
            // get the source and target from our list of entities;
            var source;
            var target;
            if (subject.id !== relationship.subject) {
              source = {
                id : relationship.subject,
                label : relationship.subjectlabel,
                practicedinqueensland : relationship.subjectpracticedinqueensland,
                type : relationship.subjectype,
                architect : relationship.subjectarchitect,
                media : relationship.media
              };
            } else {
              source = subject;
            }
            if (subject.id !== relationship.object) {
              target = {
                id : relationship.object,
                label : relationship.objectlabel,
                practicedinqueensland : relationship.objectpracticedinqueensland,
                type : relationship.objecttype,
                architect : relationship.objectarchitect,
                media : relationship.media
              };
            } else {
              target = subject;
            }
            if (!angular.isDefined(source.count)) {
              source.count = 1;
            }
            if (!angular.isDefined(target.count)) {
              target.count = 1;
            }
            var link = {
              source : source,
              target : target
            };
            links.push(link);
          } else {
            var matchedLink = matchedLinks[0];
            matchedLink.source.count++;
            matchedLink.target.count++;
          }
        }
      });
      var entities = [];
      angular.forEach(links, function(link) {
        var linksource = false;
        angular.forEach(entities, function(n) {
          if (n.id === link.source.id) {
            linksource = true;
          }
        });
        if (!linksource) {
          entities.push(link.source);
        }
        var linktarget = false;
        angular.forEach(entities, function(n) {
          if (n.id === link.target.id) {
            linktarget = true;
          }
        });
        if (!linktarget) {
          entities.push(link.target);
        }
      });

      $scope.data = {
        nodes : entities,
        links : links
      };
      // console.log($scope.data);
      $scope.nodeSelected = function(node) {
        $scope.selected = node;
        $scope.selectedRelationships = [];
        if (node) {
          angular.forEach(relationships, function(relationship) {
            if ((angular.isDefined(relationship.subject) && (relationship.subject === node.id)) ||
                (angular.isDefined(relationship.object) && (relationship.object === node.id))) {
              $scope.selectedRelationships.push(relationship);
            }
          });
        }
      };

      $scope.getArchitectIdofInterviews = function(interviewId) {
        var architectId;
        angular.forEach(interviews, function(interview) {
          angular.forEach(interview.interviews, function(ii) {
            if (ii === interviewId) {
              architectId = interview.interviewee;
            }
          });
        });
        return architectId;
      };

      $scope.isArchitectFromInterview = function(interviewId) {
        var isarchitect;
        angular.forEach(interviews, function(interview) {
          angular.forEach(interview.interviews, function(ii) {
            if (ii === interviewId) {
              isarchitect = interview.architect;
            }
          });
        });
        return isarchitect;
      };

      var deleteRelationship = function(relationship) {
        var r = window.confirm('Delete this relationship?');
        if (r === true) {
          return $http.delete(Uris.WS_ROOT + 'relationship/' + relationship.relationshipid, {
            withCredentials : true
          }).then(function(response) {
            var index = $scope.selectedRelationships.indexOf(relationship);
            $scope.selectedRelationships.splice(index, 1);
            toaster.pop('success', 'Relationship deleted');
            console.log('deleted relationship id: ' + response.data.id);
            return response.data;
          }, function(response) {
            toaster.pop('error', 'Error occured', response.data.msg);
            console.log('error message: ' + response.data.msg);
          });
        }
      };

      $scope.deleteRelationship = function(id) {
        deleteRelationship(id).then(function() {
          $state.reload();
        });
      };
    });