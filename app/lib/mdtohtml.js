var yfm = require('yfm')
var marked = require('marked')
var renderer = new marked.Renderer()

// renderer.heading = function (text, level) {
//   var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-')
//   return `<h${level}>
//     <a name="${escapedText}" href="#${escapedText}">${text}</a>
//   </h${level}>`
// }

module.exports = function mdtohtml (md) {
  var src = yfm(md.toString())
  if (src.context.ignore || src.context.ignored) {
    return
  }
  src.context.renderer = renderer
  src.html = marked(src.content, src.context)
  return src
}
