const html = require('yo-yo')
const moment = require('moment')

const triangleView = require('./triangle')
const navView = require('./nav')
const sectionView = require('./section')
const footerView = require('./footer')

module.exports = function (state, emit) {
  const list = state.posts.concat(state.videos)
  list.sort(function (a, b) {
    return moment(b.date) - moment(a.date)
  })
  return html`
    <body class="body-dark">
      <header>
        ${triangleView()}
      </header>
      ${navView()}
      ${list.map(function (post) {
        return sectionView(post, state, emit)
      })}
      ${footerView()}
    </body>
  `
}
