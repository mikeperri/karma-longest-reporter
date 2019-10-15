var os = require('os');

var LongestReporter = function (baseReporterDecorator, helper, props) {
    baseReporterDecorator(this);
    var maximumDisplay = props.maximumDisplay || 10;
    var minimumMillis = props.minimumMillis || 0;
    var write = process.stdout.write.bind(process.stdout);
    var specs = [];

    this.onSpecComplete = function (browser, result) {
        var name = result.suite.join(' ') + ' ' + result.description;
        var time = result.time;

        specs.push({
            name: name,
            time: time
        });
    };

    this.onBrowserComplete = function (browser) {
        var longestSpecs = specs
            .sort(function (a, b) {
                return a.time < b.time ? 1 : -1;
            })
            .slice(0, maximumDisplay);
        
            longestSpecs
            .filter(function (spec) {
                return spec.time > minimumMillis;
            })
            .forEach(function (spec) {
                write(helper.formatTimeInterval(spec.time) + ': ' + spec.name + os.EOL);
            });
    };
};

LongestReporter.$inject = [ 'baseReporterDecorator', 'helper', 'config.longestSpecsToReport' ];

module.exports = {
    'reporter:longest': [ 'type', LongestReporter ]
};
