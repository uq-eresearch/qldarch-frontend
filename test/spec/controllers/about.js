'use strict';

describe('Controller: LoginCtrl', function () {

    // load the controller's module
    beforeEach(module('angularApp'));

    var LoginCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, Uris, $httpBackend, Auth, $state) {
        scope = $rootScope.$new();
        LoginCtrl = $controller('LoginCtrl', {
            $scope: scope,
            Uris: Uris,
            $http: $httpBackend,
            Auth: Auth,
            $state: $state
        });
    }));

    it('should redirect after logging in', function () {
        $state.go('main');
        $rootScope.$apply();


    })
    it('should attach a list of awesomeThings to the scope', function () {
        expect('test').toBe('test');
    });

    // // critical
    // it('ensure invalid email addresses are caught', function() {});
    // it('ensure valid email addresses pass validation', function() {});
    // it('ensure submitting form changes path', function() { });

    // // nice-to-haves
    // it('ensure client-side helper shown for empty fields', function() { });
    // it('ensure hitting enter on password field submits form', function() { });

});