const html = require('yo-yo')

module.exports = function (state, emit) {
  return html`
  <footer>
    <a href="https://www.patreon.com/shama" target="_blank" rel="noopener noreferrer">SUPPORT ME ON PATREON</a>
    <span>|</span>
    <a href="https://www.youtube.com/user/kylerobinsonyoung" target="_blank" rel="noopener noreferrer">LETS WRITE CODE ON YOUTUBE</a>
    <span>|</span>
    <a href="https://twitter.com/shamakry" target="_blank" rel="noopener noreferrer">TWITTER</a>
    <span>|</span>
    <a href="https://github.com/shama" target="_blank" rel="noopener noreferrer">GITHUB</a>
  </footer>
  `
}
