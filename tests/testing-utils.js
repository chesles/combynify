var browserify = require('browserify');
var combynify = require('../index');
var path = require('path');
var through = require('through2');

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

  var compiledTemplate = '';

  var stream = browserify()
    .transform(combynify, settings)
    .add(filePath)
    .bundle();

  stream.on('data', function(data) {
    compiledTemplate += data;
  }).on('end', function() {
    callback(null, compiledTemplate);
  }).on('error', function(err) {
    callback(err);
  });

  return stream;
}

module.exports = {
  browserify: browserifyFile
};
