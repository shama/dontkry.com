const html = require('yo-yo')
const window = require('global/window')
const document = require('global/document')

module.exports = function (state, emit) {
  return html`
    <nav>SHAMA</nav>
  `
}

if (window.requestAnimationFrame) {
  const raf = window.requestAnimationFrame.bind(window)
  const name = new Array(32)
  const names = [
    'SHAMA',
    'KYLE ROBINSON YOUNG',
    'HOW IS YOUR DAY',
    'READ ANY GOOD BOOKS LATELY',
    'אתה מדבר עברית',
    'TAL VEZ HABLAS ESPANOL',
    'LET MY CAMERON GO',
    'SEE YOU SPACE COWBOY',
  ].map(function (n) {
    if (n.length >= name.length) {
      return n
    } else {
      return (new Array(name.length - n.length + 1)).join(' ') + n
    }
  })
  var nameIndex = 0
  var nameCache = Object.create({})
  raf(function loop() {
    const element = document.querySelector('nav')
    if (!element) return setTimeout(raf, 1000, loop)
    const pos = parseInt(Math.random() * name.length, 10)
    for (var i = 0; i < name.length; i++) {
      const current = element.textContent.charAt(i)
      if (!nameCache[i] && Math.random() > .9) {
        if (current === '#') {
          name[i] = names[nameIndex].charAt(i)
          nameCache[i] = 1
        } else {
          name[i] = '#'
        }
      }
    }
    element.textContent = name.join('')
    if (element.textContent === names[nameIndex]) {
      nameIndex += 1
      if (nameIndex >= names.length) nameIndex = 0
      nameCache = Object.create({})
      setTimeout(raf, 10000, loop)
    } else {
      setTimeout(raf, 100, loop)
    }
  })
}
