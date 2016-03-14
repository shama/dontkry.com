var yo = require('yo-yo')
var csjs = require('csjs')
var nav = require('./views/nav')

module.exports = function app (page) {
  return yo`<div class="${styles.app}">
    <div class="${styles.nav}">
      <h2>DONTKRY</h2>
      <br />
      ${nav()}
    </div>
    <div class="${styles.content}">
      ${page}
    </div>
  </div>`
}

var styles = module.exports.styles = csjs`
.app {
  display: flex;
}
.nav {
  flex: auto;
  width: 20%;
  padding: 1em;
  position: fixed;
}
.content {
  flex: auto;
  width: 80%;
  padding: 1em;
  margin-left: 20%;
}
`
