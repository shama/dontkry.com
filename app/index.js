var yo = require('yo-yo')
var csjs = require('csjs')
var nav = require('./views/nav')

module.exports = function app (page) {
  return yo`<div class="app">
    <div class="nav">
      <h2>DONTKRY</h2>
      <br />
      ${nav()}
    </div>
    <div class="content">
      ${page}
    </div>
  </div>`
}
