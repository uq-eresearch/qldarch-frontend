'use strict';
/* global jasmine */

describe('bs-affix', function () {

  var $compile, scope, sandbox;

  beforeEach(module('mgcrea.bootstrap.affix'));

  beforeEach(inject(function (_$rootScope_, _$compile_, _$q_, _$window_) {
    scope = _$rootScope_;
    $compile = _$compile_;
    sandbox = $('<div>').attr('id', 'sandbox').appendTo('body');
    window.scrollTo(0, 2000);
  }));

  afterEach(function() {
    sandbox.remove();
    scope.$destroy();
  });

  var templates = {
    'affix-default': {
      element: '<div class="container" style="height: 2000px">'
             + '  <div style="height: 200px; background: blue;"></div>'
             + '  <div style="width: 100px; height: 100px; background: red; margin-top:20px;" wg-affix data-offset-top="-50" data-offset-bottom="1000"></div>'
             + '</div>'
    }
  };

  function compileDirective(template, locals) {
    template = templates[template];
    angular.extend(scope, template.scope, locals);
    var element = $(template.element).appendTo(sandbox);
    element = $compile(element)(scope);
    scope.$digest();
    return jQuery(element[0]);
  }

  function scrollTo(x, y) {
    var scrollEvent = document.createEvent('Event');
    scrollEvent.initEvent('scroll', true, true);
    window.scrollTo(x, y);
    window.dispatchEvent(scrollEvent);
  }

  // Tests

  describe('karma', function () {

    it('should support window.scrollTo', function() {
      var windowEl = angular.element(window);
      var spy = jasmine.createSpyObj('spy', ['scroll', 'click']);
      windowEl.on('scroll', spy.scroll);
      windowEl[0].scrollTo(0, 100);
      expect(spy.scroll).toHaveBeenCalled();
      expect(windowEl[0].pageYOffset).toEqual(100);
    });

    // it('with default model values', function () {
    //   var element = compileDirective('affix-default').find('[wg-affix]');

    //   dump(element.attr('class'));
    //   scrollTo(0, 400);
    //   dump(element.attr('class'));
    //   scrollTo(0, 1200);
    //   dump(element.attr('class'));

    // });

  });

});
