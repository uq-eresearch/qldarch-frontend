var env = require('./environment.js');

exports.config = {

    specs: [
        './e2e/**/*.spec.js'
    ],

    baseUrl: 'http://127.0.0.1:9000',
    allScriptsTimeout: 500000,

    params: {
        login: {
            username: env.login.username,
            password: env.login.password
        }
    }
}