describe("Upload Image", function() {
    describe("Publication Date", function () {

        var heading;

        //beforeEach(function() {
            //browser.get('#/article?articleId=aHR0cDovL3FsZGFyY2gubmV0L29tZWthL2l0ZW1zL3Nob3cvMTEwMg');
            //heading = element(by.cssContainingText('h5', 'Publication Date'));
        //});

        browser.get('#/upload/image');

        iit('should let you select architects or projects', function() {
            element(by.css('.select2-choice')).click();
            element(by.css('input.select2-input')).sendKeys('Graham Young');
            element(by.css('li.select2-result')).click();
            //expect(heading.isPresent()).toBe(true);
            expect(element(by.css('.select2-chosen')).getText()).toBe('Graham Young (Architect)');
        });

        iit('should have message about file upload limits', function() {
            var warning = element(by.cssContainingText('p', 'Remember'));
            expect(warning.getText()).toBe('Remember, all scanned images should be no more than 72DPI');
        });
        //it('should show "no date recorded" if there is no date', function() {
        //    var date = element(by.cssContainingText('p', 'No date recorded'));
        //    expect(date.isPresent()).toBe(true);
        //});
    });
});
