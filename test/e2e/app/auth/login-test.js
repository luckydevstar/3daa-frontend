module.exports = {
    before: function(browser) {
        browser.maximizeWindow();
    },
    'user can signin': function(browser) {

        const home = browser.page.home();
        const login = browser.page.login();

        home.navigate();
        //Wait for the app to start
        // home.expect.element('@loadingOverlay').not.to.be.visible.before(5000);
        home.expect.element('@signin').to.be.visible;
        //browser.pause(10000)
        home.click('@signin');

        // use the signin PageObject from this point to keep
        // the tests sane
        login.expect.element('@email').to.be.visible.before(2000);
        login.expect.element('@password').to.be.visible;

        login.expect.element('@loginButton').to.be.visible;
        login.setValue('@email', 'jolyon@depub.co.uk')
            .setValue('@password', '12345678');

        login.click('@loginButton');

        browser.expect.element('.dashboard-container').text.to.contain('Hi').before(2000);
    },
    after: function(browser) {
        browser.end();
    }
};
