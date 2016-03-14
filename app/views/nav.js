var yo = require('yo-yo')
var csjs = require('csjs')

module.exports = function nav () {
  return yo`<ul class="${styles.nav}">
    <li><a href="#/">BLOG</a></li>
    <li><a href="https://youtube.com/kylerobinsonyoung" target="_blank">VIDEOS</a></li>
    <li><a href="#/about.html">ABOUT</a></li>
    <li><a href="https://twitter.com/shamakry" target="_blank">@SHAMAKRY</a></li>
    <li><a href="https://github.com/shama" target="_blank">GITHUB</a></li>
  </ul>`
}

var styles = module.exports.styles = csjs`
.nav {
  padding: 0;
  margin: 0;
  zoom: 1;
  overflow: auto;
}
.nav li {
  list-style: none;
  text-transform: uppercase;
  padding: .3rem;
}
.nav li:hover {
}
.nav a {
  text-decoration: none;
  cursor: pointer;
}
`
