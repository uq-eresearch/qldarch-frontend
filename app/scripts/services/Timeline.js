'use strict';

angular.module('qldarchApp').service('Timeline', function Timeline($http, $filter, Uris) {

  function addToTimelineDate(tld, obj, id) {
    var media;
    var thumb;
    var icon = 'images/icon.png';
    var opentag = '';
    var closetag = '';
    var label = '';
    if (angular.isDefined(obj.media)) {
      thumb = Uris.WS_MEDIA + obj.media + '?dimension=24x24';
      media = '<img src=' + Uris.WS_MEDIA + obj.media + '?dimension=320x307' + '>';
    } else {
      media = icon;
      thumb = icon;
    }
    if (obj.subject !== id) {
      label = obj.subjectlabel;
      if (obj.subjectype === 'person' && obj.subjectarchitect === true) {
        opentag = '<a href="#/architect/summary?architectId=' + obj.subject + '">';
        closetag = '</a>';
      } else if (obj.subjectype === 'person' && obj.subjectarchitect === false) {
        opentag = '<a href="#/other/summary?otherId=' + obj.subject + '">';
        closetag = '</a>';
      } else if (obj.subjectype === 'firm') {
        opentag = '<a href="#/firm/summary?firmId=' + obj.subject + '">';
        closetag = '</a>';
      } else if (obj.subjectype === 'structure') {
        opentag = '<a href="#/project/summary?structureId=' + obj.subject + '">';
        closetag = '</a>';
      }
    } else {
      label = obj.objectlabel;
      if (obj.objecttype === 'person' && obj.objectarchitect === true) {
        opentag = '<a href="#/architect/summary?architectId=' + obj.object + '">';
        closetag = '</a>';
      } else if (obj.objecttype === 'person' && obj.objectarchitect === false) {
        opentag = '<a href="#/other/summary?otherId=' + obj.object + '">';
        closetag = '</a>';
      } else if (obj.objecttype === 'firm') {
        opentag = '<a href="#/firm/summary?firmId=' + obj.object + '">';
        closetag = '</a>';
      } else if (obj.objecttype === 'structure') {
        opentag = '<a href="#/project/summary?structureId=' + obj.object + '">';
        closetag = '</a>';
      }
    }
    tld.asset = {
      'media' : media,
      'thumbnail' : thumb,
      'caption' : '<h4 style="text-align:center;text-transform: capitalize">' + opentag + label + closetag + '</h4>'
    };
    return tld;
  }

  // AngularJS will instantiate a singleton by calling "new" on this
  // function
  this.relationshipsToEvents = function(relationships, id) {
    var dates = [];
    angular.forEach(relationships, function(relationship) {
      var timelineDate = {};
      if (angular.isDefined(relationship.fromyear)) {
        timelineDate.startDate = JSON.stringify(relationship.fromyear);
        if (angular.isDefined(relationship.untilyear)) {
          timelineDate.endDate = JSON.stringify(relationship.untilyear);
        }
      } else {
        if (angular.isDefined(relationship.untilyear)) {
          timelineDate.startDate = JSON.stringify(relationship.untilyear);
          timelineDate.endDate = JSON.stringify(relationship.untilyear);
        } else {
          if (angular.isDefined(relationship.objectcompletion)) {
            timelineDate.startDate = JSON.stringify(relationship.objectcompletion).substring(1, 5);
            timelineDate.endDate = JSON.stringify(relationship.objectcompletion).substring(1, 5);
          }
        }
      }
      timelineDate.headline = relationship.subjectlabel + ' ' + relationship.relationship + ' ' + relationship.objectlabel;
      if (angular.isDefined(relationship.note)) {
        timelineDate.text = '<p>' + relationship.note + '</p>';
      } else {
        timelineDate.text = '<p></p>';
      }
      dates.push(addToTimelineDate(timelineDate, relationship, id));
    });
    return dates;
  };
});