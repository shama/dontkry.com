var hl = require('highlight.js')
module.exports = function() {
  var codes = document.getElementsByTagName('code')
  var codemap = {
    shell: null,
    html: 'xml',
    json: 'javascript',
  }
  for (var i = 0; i < codes.length; i++) {
    var lang = String(codes[i].className).match(/lang-(\w+)/)
    lang = lang ? lang[1] : null
    if (codemap.hasOwnProperty(lang)) lang = codemap[lang]
    if (lang) {
      try {
        codes[i].innerHTML = hl.highlight(lang, codes[i].childNodes[0].nodeValue).value
      } catch (err) {
        console.error(err.message)
      }
    }
  }
}