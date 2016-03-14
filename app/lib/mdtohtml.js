var yfm = require('yfm')
var marked = require('marked')

module.exports = function mdtohtml (md) {
  var src = yfm(md.toString())
  if (src.context.ignore || src.context.ignored) {
    return
  }
  src.html = marked(src.content, src.context)
  return src
}
