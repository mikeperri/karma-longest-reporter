const os = require('os');

const LongestReporter = function (baseReporterDecorator, helper, { maximumDisplay = 10, minimumMillis = 0 }) {
    baseReporterDecorator(this);

    const write = process.stdout.write.bind(process.stdout);
    const specs = [];

    this.onSpecComplete = function (browser, result) {
        const name = result.suite.join(' ') + ' ' + result.description;
        const time = result.time;

        specs.push({
            name,
            time
        });
    };

    this.onBrowserComplete = function (browser) {
        const longestSpecs = specs
            .sort((a, b) => (a.time < b.time ? 1 : -1))
            .slice(0, maximumDisplay);

        longestSpecs
            .filter(spec => spec.time > minimumMillis)
            .forEach(spec =>
                write(helper.formatTimeInterval(spec.time) + ': ' + spec.name + os.EOL)
            );
    };
};

LongestReporter.$inject = ['baseReporterDecorator', 'helper', 'config.longestSpecsToReport'];

module.exports = {
    'reporter:longest': ['type', LongestReporter]
};
