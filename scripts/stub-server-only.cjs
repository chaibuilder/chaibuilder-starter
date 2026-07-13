/**
 * Payload CLI loads chaipro/payload → `server-only` throws outside Next RSC.
 * --require this before payload generate:* / payload CLI.
 * ESM resolves to absolute path, so match by name not only bare specifier.
 */
const Module = require('module')
const origLoad = Module._load
Module._load = function (request, parent, isMain) {
  if (typeof request === 'string' && /(^|[/\\])server-only([/\\]|$)/.test(request)) {
    return {}
  }
  return origLoad.apply(this, arguments)
}
