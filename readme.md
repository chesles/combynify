# combynify

[combyne][combyne] precompiler plugin for [browserify][browserify].

# features

- Optimizes templates into dependency-free isolated objects
- Recursively bundles all referenced filters, partials, and template
  inheritance

# usage

#### installation

Install `combynify` from npm, probably as a devDependency:

``` sh
npm install --save-dev combynify
```

Use it as a browserify transform with `-t`:

``` sh
browerify -t combynify main.js > bundle.js
```

#### configure extensions

If you're planning on using an extension other than `html`, you should
configure the `extension` option using [Browserify's configuration](https://github.com/substack/browserify-handbook#configuring-transforms).

Set like:

``` sh
browserify -t [ combynify --extension .tmpl ] index.js > dist/out.js
```

#### requiring

main.js can look something like this:

``` javascript
var template = require('./hello.combyne')
console.log(template.render({ who: 'world' }))
```

`hello.combyne` is a text file like this:

``` handlebars
hello, {{ who }}
```

This is the equivalent of doing:

``` javascript
var template = combyne('hello, {{ who }}')
console.log(template.render({ who: 'world' }))
```

so you can use all of combyne's fancy features like filters and partials:

``` javascript
var template = require('./hello.combyne')
template.registerFilter(...)
template.registerPartial(...)
console.log(template.render({ who: 'world' }))
```

[combyne]: https://github.com/tbranyen/combyne
[browserify]: https://github.com/substack/node-browserify
