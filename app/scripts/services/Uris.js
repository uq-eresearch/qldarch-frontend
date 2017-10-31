'use strict';

angular.module('qldarchApp').service('Uris', function() {
  // AngularJS will instantiate a singleton by calling 'new' on this function
  this.local = true;
  this.QLDARCH_UI = 'https://swift.rc.nectar.org.au:8888/v1/AUTH_3b88d73c121e460ab8acd3c031c2d6ed/qldarch-ui/';
  this.WS_ROOT = '/ws/';
  this.WS_MEDIA = '/ws/media/';
  this.WS_DOWNLOAD = '/ws/media/download/';
  this.reCAPTCHASiteKey = '6Lf2kDYUAAAAANnv8xSvpjyVxoNvf5pCA7JxkwIY';
});