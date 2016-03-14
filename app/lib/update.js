var document = require('global/document')
var yo = require('yo-yo')

module.exports = function update (f, t) {
  if (typeof f === 'string') {
    f = document.querySelector(f)
  }
  function onmorph (f, t) {
    f.onclick = t.onclick
  }
  yo.update(f, t, {
    onBeforeMorphEl: onmorph,
    onBeforeMorphElChildren: onmorph
  })
}
