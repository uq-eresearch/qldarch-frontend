'use strict';

angular.module('qldarchApp').controller('TimelineViewerCtrl', function($scope, compobj, CompObj, $state, Auth, Uris, $filter) {

  $scope.compoundObject = compobj;
  $scope.timeline = compobj;

  if (angular.isDefined(Auth.user) && angular.isDefined($scope.compoundObject.user)) {
    $scope.isDeletable = Auth.success && ($scope.compoundObject.user.displayName === Auth.user.displayName || Auth.user.role === 'admin');
  }

  $scope.delete = function() {
    var r = window.confirm('Delete this timeline?');
    if (r === true) {
      CompObj.delete(compobj.id).then(function() {
        $state.go('main');
      });
    }
  };

  angular.forEach($scope.timeline.dates, function(date) {
    if (angular.isDefined(date.startDate)) {
      date.startDate = JSON.stringify(date.startDate);
      if (angular.isDefined(date.endDate)) {
        date.endDate = JSON.stringify(date.endDate);
      }
    } else {
      if (angular.isDefined(date.endDate)) {
        date.startDate = JSON.stringify(date.endDate);
      }
    }
    if (angular.isDefined(date.text)) {
      date.text = '<p>' + date.text + '</p>';
    } else {
      date.text = '<p></p>';
    }
    var media;
    var thumb;
    var icon = 'images/icon.png';
    var opentag = '';
    var closetag = '';
    var label = '';
    if (angular.isDefined(date.archobj)) {
      if (angular.isDefined(date.archobj.media) && date.archobj.media.length > 0) {
        var med = date.archobj.media;
        var mediaId;
        var pref = $filter('orderBy')(med, function(m) {
          return m.preferred;
        });
        if (pref.length > 0) {
          mediaId = pref[0].id;
        } else {
          mediaId = med[0].id;
        }
        thumb = Uris.WS_MEDIA + mediaId + '?dimension=65x65';
        media = '<img src=' + Uris.WS_MEDIA + mediaId + '?dimension=320x307' + '>';
      } else {
        media = icon;
        thumb = icon;
      }
      label = date.archobj.label;
      if (date.archobj.type === 'person' && date.archobj.architect === true) {
        opentag = '<a href="/architect/summary?architectId=' + date.archobj.id + '">';
        closetag = '</a>';
      } else if (date.archobj.type === 'person' && date.archobj.architect === false) {
        opentag = '<a href="/other/summary?otherId=' + date.archobj.id + '">';
        closetag = '</a>';
      } else if (date.archobj.type === 'firm') {
        opentag = '<a href="/firm/summary?firmId=' + date.archobj.id + '">';
        closetag = '</a>';
      } else if (date.archobj.type === 'structure') {
        opentag = '<a href="/project/summary?structureId=' + date.archobj.id + '">';
        closetag = '</a>';
      }
    } else {
      media = icon;
      thumb = icon;
    }
    date.asset = {
      'media' : media,
      'thumbnail' : thumb,
      'caption' : '<h4 style="text-align:center;text-transform: capitalize">' + opentag + label + closetag + '</h4>'
    };
  });
});