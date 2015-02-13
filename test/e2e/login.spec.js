describe("Login", function() {
    //describe("Publication Date", function () {

        //var heading;
        beforeEach(function() {
            browser.get('#/');
            //heading = element(by.cssContainingText('h5', 'Publication Date'));
        });

        it('should be able to log in', function() {
            var loginButton = element(by.linkText('LOG IN'));
            expect(loginButton.isPresent()).toBe(true);
            loginButton.click();

            var email = element(by.css('input#email'));
            email.sendKeys(browser.params.login.username);

            var password = element(by.css('input#password'));
            password.sendKeys(browser.params.login.password);

            var button = element(by.buttonText('Log In'));
            button.click();

            browser.sleep(3000);

            // Test log in
            browser.get('#/user/settings');
            expect(browser.getCurrentUrl()).toBe(browser.baseUrl + '/#/user/settings');
        });
    //});
});
