var through = require('through2')
var combyne = require('combyne')

var extensions = {
  cmb: 1,
  cmbn: 1,
  combyne: 1,
}

function combynify(file) {
  if (!extensions[file.split(".").pop()]) return through()

  var chunks = []
  function parts(chunk, enc, callback) {
    chunks.push(chunk); callback();
  }

  function finish(callback) {
    var template = combyne(chunks.join(''))
    this.push('module.exports = ' + template.source)
    callback()
  }

  return through(parts, finish)
}

module.exports = combynify
