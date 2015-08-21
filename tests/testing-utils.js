var browserify = require('browserify');
var combynify = require('../index');
var path = require('path');
var through = require('through2');
var vm = require('vm');

function noop() {}

/**
 * Compile a template and pass it to the provided callback
 *
 * @param {Object}   settings         Combynify transform settings object
 * @param {String}   settings.root    directory to use for view lookup
 * @param {String}   [fileName]       The name of the file to browserify
 * @param {Function} [callback]       The callback function to call when the
 *                                     browserify build completes
 * @return the browserify build stream
 */
function browserifyFile(settings, fileName, callback) {
  // fileName is optional
  if (typeof fileName === 'function') {
    callback = fileName;
    fileName = '';
  }

  // Callback is optional because it is unneeded for some tests
  callback = callback || noop;

  var filePath = path.join(settings.root, fileName || 'render.js');

  var compiledModule = '';

  var stream = browserify(filePath, {
      // Name the module's output for later access in `execute()`
      standalone: 'output'
    })
    .transform(combynify, settings)
    .bundle();

  stream.on('data', function(data) {
    compiledModule += data;
  }).on('end', function() {
    // require('fs').writeFileSync(process.cwd() + '/salone.js', compiledModule);
    callback(null, compiledModule);
  }).on('error', function(err) {
    callback(err);
  });

  return stream;
}

function execute(compiledModule) {
  var context = {};
  // Due to `standalone: 'render'` above, string property "output" is set on context
  vm.runInNewContext(compiledModule, context);
  return context.output.trim();
}

module.exports = {
  browserify: browserifyFile,
  execute: execute
};
