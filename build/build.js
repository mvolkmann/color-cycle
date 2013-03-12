

/**
 * hasOwnProperty.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);
  var index = path + '/index.js';

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (has.call(require.modules, path)) return path;
  }

  if (has.call(require.aliases, index)) {
    return require.aliases[index];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!has.call(require.modules, from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return has.call(require.modules, localRequire.resolve(path));
  };

  return localRequire;
};
require.register("component-stack/index.js", Function("exports, require, module",
"\n/**\n * Expose `stack()`.\n */\n\nmodule.exports = stack;\n\n/**\n * Return the stack.\n *\n * @return {Array}\n * @api public\n */\n\nfunction stack() {\n  var orig = Error.prepareStackTrace;\n  Error.prepareStackTrace = function(_, stack){ return stack; };\n  var err = new Error;\n  Error.captureStackTrace(err, arguments.callee);\n  var stack = err.stack;\n  Error.prepareStackTrace = orig;\n  return stack;\n}//@ sourceURL=component-stack/index.js"
));
require.register("component-assert/index.js", Function("exports, require, module",
"\n/**\n * Module dependencies.\n */\n\nvar stack = require('stack');\n\n/**\n * Load contents of `script`.\n *\n * @param {String} script\n * @return {String}\n * @api private\n */\n\nfunction getScript(script) {\n  var xhr = new XMLHttpRequest;\n  xhr.open('GET', script, false);\n  xhr.send(null);\n  return xhr.responseText;\n}\n\n/**\n * Assert `expr` with optional failure `msg`.\n *\n * @param {Mixed} expr\n * @param {String} [msg]\n * @api public\n */\n\nmodule.exports = function(expr, msg){\n  if (expr) return;\n  if (!msg) {\n    if (Error.captureStackTrace) {\n      var callsite = stack()[1];\n      var fn = callsite.fun.toString();\n      var file = callsite.getFileName();\n      var line = callsite.getLineNumber() - 1;\n      var col = callsite.getColumnNumber() - 1;\n      var src = getScript(file);\n      line = src.split('\\n')[line].slice(col);\n      expr = line.match(/assert\\((.*)\\)/)[1].trim();\n      msg = expr;\n    } else {\n      msg = 'assertion failed';\n    }\n  }\n\n  throw new Error(msg);\n};//@ sourceURL=component-assert/index.js"
));
require.register("color-cycle/index.js", Function("exports, require, module",
"var html = require('./template');\n\nfunction getHtml() { return html; }\n\nfunction setup() {\n  var colorIndex = 0;\n  var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];\n\n  var block = document.getElementById('color-block');\n  var btn = document.getElementById('color-change');\n  btn.onclick = function () {\n    colorIndex = (colorIndex + 1) % colors.length;\n    block.style.backgroundColor = colors[colorIndex];\n  }\n}\n\nmodule.exports = {\n  getHtml: getHtml,\n  setup: setup\n};\n//@ sourceURL=color-cycle/index.js"
));
require.register("color-cycle/template.js", Function("exports, require, module",
"module.exports = '<div id=\"color-block\">\\n  <button id=\"color-change\">Change</button>\\n</div>\\n';//@ sourceURL=color-cycle/template.js"
));
require.alias("component-assert/index.js", "color-cycle/deps/assert/index.js");
require.alias("component-stack/index.js", "component-assert/deps/stack/index.js");

