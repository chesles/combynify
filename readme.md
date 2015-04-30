# combynify

[combyne][combyne] precompiler plugin for [browserify][browserify].

# features

- Optimizes templates into dependency-free isolated objects
- Recursively bundles all referenced filters, partials, and template
  inheritance

# usage

Install `combynify` from npm, probably as a devDependency:

    npm install --save-dev combynify

Use it as a browserify transform with `-t`:

    browerify -t combynify main.js > bundle.js

main.js can look something like this:

    var template = require('./hello.combyne')
    console.log(template.render({ who: 'world' }))

`hello.combyne` is a text file like this:

    hello, {{ who }}

This is the equivalent of doing:

    var template = combyne('hello, {{ who }}')
    console.log(template.render({ who: 'world' }))

so you can use all of combyne's fancy features like filters and partials:

    var template = require('./hello.combyne')
    template.registerFilter(...)
    template.registerPartial(...)
    console.log(template.render({ who: 'world' }))

[combyne]: https://github.com/tbranyen/combyne
[browserify]: https://github.com/substack/node-browserify
