var os = require('os');
var chalk = require('chalk');

var LongestReporter = function (baseReporterDecorator, helper, longestSpecsToReport) {
    baseReporterDecorator(this);

    var write = process.stdout.write.bind(process.stdout);
    var longestSpecsToReport = longestSpecsToReport ? longestSpecsToReport : 10;
    var specs = [];

    this.onSpecComplete = function (browser, result) {
        var name = result.suite.join(' ') + ' ' + result.description;
        var time = helper.formatTimeInterval(result.time);

        specs.push({
            name: name,
            time: time
        });
    }

    this.onBrowserComplete = function (browser) {
        var longestSpecs = specs
            .sort(function (a, b) {
                return a.time < b.time ? 1 : -1;
            })
            .slice(0, longestSpecsToReport);
        write(chalk.underline.bold('RUN-TIME SUMMARY:') + '\n');
        longestSpecs.forEach(function (spec) {
            write(chalk.cyan.bold(spec.time + ': ') + spec.name + os.EOL);
        });
    }
}

LongestReporter.$inject = [ 'baseReporterDecorator', 'helper', 'config.longestSpecsToReport' ];

module.exports = {
    'reporter:longest': [ 'type', LongestReporter ]
};
