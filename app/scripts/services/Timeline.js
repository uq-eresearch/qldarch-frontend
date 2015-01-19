'use strict';

angular.module('angularApp')
    .service('Timeline', function Timeline(Uris) {

      function addToTimelineDate(tld, obj) {
        var tempType = obj.type === 'structure' ? 'project' : obj.type;
        var link = obj.$link?obj.$link:('#/'+ tempType + '/summary?' + obj.type + 'Id=' + obj.encodedUri);
        tld.asset = {
          media: 'images/icon.png',
          thumbnail: 'images/icon.png',
          'caption': '<h3 style="text-transform: capitalize"><a href="' + link + '">' + obj.name + '</a></h3>'
        };
        if (angular.isDefined(obj.picture)) {
          tld.asset.thumbnail = obj.picture.thumb;
          tld.asset.media = obj.picture.thumb;
        }
        return tld;
      }

        // AngularJS will instantiate a singleton by calling "new" on this function
        this.relationshipsToEvents = function (relationships, entity) {
            var dates = [];
            angular.forEach(relationships, function (relationship) {
                var timelineDate = {};
                timelineDate.startDate = relationship[Uris.QA_START_DATE].substring(0, 4);
                if (angular.isDefined(relationship[Uris.QA_END_DATE])) {
                    timelineDate.endDate = relationship[Uris.QA_END_DATE].substring(0, 4);
                }
                timelineDate.headline = relationship.subject.name + ' ' + relationship.predicate[Uris.QA_LABEL].toLowerCase() + ' ' + relationship.object.name;
                if (angular.isDefined(relationship[Uris.QA_TEXTUAL_NOTE])) {
                    timelineDate.text = '<p>' + relationship[Uris.QA_TEXTUAL_NOTE] + '</p>';
                } else {
                    timelineDate.text = '<p></p>';
                }
                dates.push(addToTimelineDate(timelineDate,
                    ((entity && (relationship.subject.uri === entity.uri))?relationship.object:relationship.subject)));
            });
            return dates;
        };
    });