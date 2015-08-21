var assert = require('assert');
var path = require('path');
var utils = require('../testing-utils');
var browserify = utils.browserify;
var execute = utils.execute;

function testDirPath(testName) {
  return path.join(__dirname, testName);
}

describe('file extension configuration', function() {

  describe('extension whitelist', function() {

    it('rejects invalid extensions', function(done) {
      var stream = browserify({
        root: testDirPath('default-extensions')
      }, 'render-invalid.js');
      stream.on('error', function(err) {
        assert.ok(err);
        done();
      });
    });

    it('supports .cmb by default', function(done) {
      browserify({
        root: testDirPath('default-extensions')
      }, 'render-cmb.js', function(err, tmpl) {
        assert.equal(err, null, 'no error was thrown');
        assert.equal(typeof tmpl, 'string', 'Template is rendered to a string');
        assert.equal(execute(tmpl), 'I am a .cmb template', 'Correct template is rendered');
        done();
      });
    });

    it('supports .cmbn by default', function(done) {
      browserify({
        root: testDirPath('default-extensions')
      }, 'render-cmbn.js', function(err, tmpl) {
        assert.equal(err, null, 'no error was thrown');
        assert.equal(typeof tmpl, 'string', 'Template is rendered to a string');
        assert.equal(execute(tmpl), 'I am a .cmbn template', 'Correct template is rendered');
        done();
      });
    });

    it('supports .combyne by default', function(done) {
      browserify({
        root: testDirPath('default-extensions')
      }, 'render-combyne.js', function(err, tmpl) {
        assert.equal(err, null, 'no error was thrown');
        assert.equal(typeof tmpl, 'string', 'Template is rendered to a string');
        assert.equal(execute(tmpl), 'I am a .combyne template', 'Correct template is rendered');
        done();
      });
    });

    it('supports .html by default', function(done) {
      browserify({
        root: testDirPath('default-extensions')
      }, 'render-html.js', function(err, tmpl) {
        assert.equal(err, null, 'no error was thrown');
        assert.equal(typeof tmpl, 'string', 'Template is rendered to a string');
        assert.equal(execute(tmpl), 'I am a .html template', 'Correct template is rendered');
        done();
      });
    });

  });

  describe('configured extensions', function() {

    it('permits the use of an arbitrary file extension', function(done) {
      browserify({
        extension: '.custom',
        root: testDirPath('configured-extension')
      }, 'render-custom.js', function(err, tmpl) {
        assert.equal(err, null, 'no error was thrown');
        assert.equal(typeof tmpl, 'string', 'Template is rendered to a string');
        assert.equal(execute(tmpl), 'I am a .custom template', 'Correct template is rendered');
        done();
      });
    });

    it('permits the use of a different arbitrary file extension', function(done) {
      browserify({
        extension: '.tmpl',
        root: testDirPath('configured-extension')
      }, 'render-tmpl.js', function(err, tmpl) {
        assert.equal(err, null, 'no error was thrown');
        assert.equal(typeof tmpl, 'string', 'Template is rendered to a string');
        assert.equal(execute(tmpl), 'I am a .tmpl template', 'Correct template is rendered');
        done();
      });
    });

  });

});
