// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

module.exports = function (config) {
    var cliConfig = require('@angular/cli/models/config');
    var _fromProject = cliConfig.CliConfig.fromProject;

    cliConfig.CliConfig.fromProject = function () {
        var cfp = _fromProject.apply(this, arguments);
        var app = cfp.config.apps.filter(function (app) {
            return app.name === config.angularCli.app;
        })[0];
        if (app != null) {
            ix = cfp.config.apps.indexOf(app);
            if (ix > 0) {
                cfp.config.apps[ix] = cfp.config.apps[0];
                cfp.config.apps[0] = app;
            }
        }
        return cfp;
    }

    var cfg = {
        basePath: '',
        frameworks: ['jasmine', '@angular/cli'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage-istanbul-reporter'),
            require('@angular/cli/plugins/karma')
        ],
        captureTimeout: 210000,
        browserDisconnectTolerance: 3,
        browserDisconnectTimeout: 210000,
        browserNoActivityTimeout: 210000,
        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        files: [
            {pattern: './src/test.ts', watched: false}
        ],
        preprocessors: {
            './src/test.ts': ['@angular/cli']
        },
        mime: {
            'text/x-typescript': ['ts', 'tsx']
        },
        coverageIstanbulReporter: {
            reports: ['html', 'lcovonly'],
            fixWebpackSourcePaths: true
        },
        angularCli: {
            environment: 'dev'
        },
        reporters: config.angularCli && config.angularCli.codeCoverage
            ? ['progress', 'coverage-istanbul']
            : ['progress', 'kjhtml'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome', 'ChromeCanary'],
        customLaunchers: {
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },
        singleRun: false
    };

    if (process.env.TRAVIS) {
        cfg.browsers = ['Chrome_travis_ci'];
    }

    config.set(cfg);
};
