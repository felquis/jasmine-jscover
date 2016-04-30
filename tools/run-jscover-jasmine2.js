var system = require('system');
var fs = require('fs');

/**
 * Wait until the test condition is true or a timeout occurs. Useful for waiting
 * on a server response or for a ui change (fadeIn, etc.) to occur.
 *
 * @param testFx javascript condition that evaluates to a boolean,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
 * as a callback function.
 * @param onReady what to do when testFx condition is fulfilled,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
 * as a callback function.
 * @param timeOutMillis the max amount of time to wait. If not specified, 3 sec is used.
 */
function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 10001, //< Default Max Timeout is 10s
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
            } else {
                if(!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    console.log("'waitFor()' timeout");
                    phantom.exit(1);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 100); //< repeat check every 100ms


};


if (system.args.length !== 2 && system.args.length !== 3) {
    console.log('Usage: run-jasmine2.js URL [dir]');
    phantom.exit(1);
}

var page = require('webpage').create();

// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(msg) {
    console.log(msg);
};

page.open(system.args[1], function(status) {
    if (status !== "success") {
        console.log("Unable to access network");
        phantom.exit();
    } else {
        waitFor(function(){
            return page.evaluate(function(){
				function checkJasmineVersion(version) {
					// version resolve, manage jasmine execution for each jasmine version
					var versions = {
						latest: this['2.4.1'],
						// https://github.com/jasmine/jasmine/blob/v2.0.0/src/html/HtmlReporter.js#L23
						// https://github.com/jasmine/jasmine/blob/v2.0.1/src/html/HtmlReporter.js#L24
						'2.0.x': function () {
					        return document.body.querySelector('.jasmine_html-reporter .duration') !== null
						},
						// https://github.com/jasmine/jasmine/blob/v2.4.1/src/html/HtmlReporter.js#L28
						'2.4.x': function () {
							// this line make it works with pending tests
							return document.body.querySelector('.jasmine-duration').innerText.indexOf('finished in') !== -1
						},
					}

					// if there's no version use the latest
					if (!version) { return versions['latest']() }

					// put a X in the end of the version
					version = version.replace(/(\d.\d).(\d)/, '$1.x')

					// check if this version is set
					if (versions[version]) { return versions[version]() }
					// if not set, use latest insted
					else { return versions['latest']() }
				}

                return checkJasmineVersion(jasmineRequire && jasmineRequire.version() || 0)
            });
        }, function(){
            var exitCode = page.evaluate(function(){
                console.log('');

                var title = 'Jasmine';
                var version = document.body.querySelector('.jasmine-version').innerText;
                var duration = document.body.querySelector('.jasmine-duration').innerText;
                var banner = title + ' ' + version + ' ' + duration;
                console.log(banner);

                var list = document.body.querySelectorAll('.jasmine-results > .jasmine-failures > .jasmine-spec-detail.jasmine-failed');
                if (list && list.length > 0) {
                    console.log('');
                    console.log(list.length + ' test(s) FAILED:');
                    for (i = 0; i < list.length; ++i) {
                        var el = list[i],
                            desc = el.querySelector('.jasmine-description'),
                            msg = el.querySelector('.jasmine-messages > .jasmine-result-message');
                        console.log('');
                        console.log(desc.innerText);
                        console.log(msg.innerText);
                        console.log('');
                    }
                    return 1;
                } else {
                    console.log(document.body.querySelector('.jasmine-alert > .jasmine-bar.jasmine-passed,.jasmine-alert > .jasmine-bar.jasmine-skipped').innerText);
                    return 0;
                }
            });
            if (system.args.length == 2) {
                page.evaluate(function(){
                    jscoverage_report('phantom');
                });
            } else {
                var json = page.evaluate(function(){
                    return jscoverage_serializeCoverageToJSON();
                });
                try {
                    fs.write(system.args[2] + '/jscoverage.json', json, 'w');
                } catch(e) {
                    console.log(e);
                }
            }
            phantom.exit(exitCode);
        });
    }
});
