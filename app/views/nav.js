var yo = require('yo-yo')

module.exports = function nav () {
  return yo`<ul>
    <li><a href="/">BLOG</a></li>
    <li><a href="https://youtube.com/kylerobinsonyoung" target="_blank">VIDEOS</a></li>
    <li><a href="/about.html">ABOUT</a></li>
    <li><a href="https://twitter.com/shamakry" target="_blank">@SHAMAKRY</a></li>
    <li><a href="https://github.com/shama" target="_blank">GITHUB</a></li>
  </ul>`
}
