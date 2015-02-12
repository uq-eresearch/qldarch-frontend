/**
 Feature: Age of Onsent
 I want to be able to read the age of onset
 As a medical professional
 So that I can understand more about the disorder

 Scenario:
 Given I am on a disorder page
 Then I should be able to see the age of onset
 */

describe("Article", function() {
    describe("Publication Date", function () {

        var heading;

        beforeEach(function() {
            browser.get('#/article?articleId=aHR0cDovL3FsZGFyY2gubmV0L29tZWthL2l0ZW1zL3Nob3cvMTEwMg');
            heading = element(by.cssContainingText('h5', 'Publication Date'));
        });

        it('should show a publication date', function() {
            expect(heading.isPresent()).toBe(true);
        });

        it('should show "no date recorded" if there is no date', function() {
            var date = element(by.cssContainingText('p', 'No date recorded'));
            expect(date.isPresent()).toBe(true);
        });
    });
});
