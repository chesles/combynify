var fs = require('fs');
var path = require('path');
var through = require('through2');
var combyne = require('combyne');
var visitCombyne = require('visit-combyne');

var extendsCache = {};

var extensions = {
  html: 1,
  cmb: 1,
  cmbn: 1,
  combyne: 1,
};

var processTemplate = function(templateSource, settings, callback) {
  var root = settings.root;
  var template = combyne(templateSource);

  // Find all extend.
  var extend = visitCombyne(template.tree.nodes, function(node) {
    return node.type === 'ExtendExpression';
  }).map(function(node) { return node.value; });

  // Find all partials.
  var partials = visitCombyne(template.tree.nodes, function(node) {
    return node.type === 'PartialExpression' && !extendsCache[node.value];
  }).map(function(node) { return node.value; });

  // Find all filters.
  var filters = visitCombyne(template.tree.nodes, function(node) {
    return node.filters && node.filters.length;
  }).map(function(node) {
    return node.filters.map(function(filter) {
      return filter.value;
    }).join(' ');
  });

  // Flatten the array.
  if (filters.length) {
    filters = filters.join(' ').split(' ');
  }

  // Filters cannot be so easily inferred location-wise, so assume they are
  // preconfigured or exist in a filters directory.
  var filtersDir = settings.filtersDir || 'filters';

  filters.forEach(function(filterName) {
    // Register the exported function.
    template._filters[filterName] = path.join(root, filtersDir, filterName);
  });

  // Map all partials to functions.
  partials.forEach(function(name) {
    template._partials[name] = path.resolve(path.join(root, name + '.html'));
  });

  // Map all extend to functions.
  extend.forEach(function(render) {
    var name = render.template;
    var superTemplate = path.resolve(path.join(root, name + '.html'));

    // Pre-cache this template.
    extendsCache[render.partial] = true;

    // Set the partial to the super template.
    template._partials[name] = superTemplate;
  });

  // Augment the template source to include dependencies.
  var lines = template.source.split('\n');

  partials = Object.keys(template._partials).map(function(name) {
    return '"' + name + '": require("' + template._partials[name] + '")';
  });

  filters = Object.keys(template._filters).map(function(name) {
    return '"' + name + '": require("' + template._filters[name] + '")';
  });

  // This replaces the partials and filters inline.
  lines[1] = '_partials: {' + partials.join(',') + '},';
  lines[2] = '_filters: {' + filters.join(',') + '},';

  // Flatten the template to remove unnecessary `\n` whitespace.
  template.source = lines.join('\n');

  if (this.push) {
    this.push('module.exports = ' + template.source);
  }

  callback.call(this, template);
};

function combynify(file, settings) {
  if (!extensions[file.split('.').pop()]) return through();

  settings = settings || {};

  // Mimic how the actual Combyne stores.
  settings._filters = {};
  settings._partials = {};
  settings.root = settings.root || path.join(process.cwd(), 'views');
  settings._filepath = file;

  var chunks = [];

  function parts(chunk, enc, callback) {
    chunks.push(chunk); callback();
  }

  return through(parts, function(callback) {
    try {
      processTemplate.call(this, chunks.join(''), settings, function(template) {
        callback();
      });
    } catch( err ) {
      // Annotate error with the file in which it originated
      err.message = err.message + ' in ' + file;
      throw err;
    }
  });
}

module.exports = combynify;
