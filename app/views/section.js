const html = require('yo-yo')
const moment = require('moment')

module.exports = function (post, state, emit) {
  if (post.videoid) {
    return html`
      <section onclick=${openvideo(post.videoid)}>
        <svg viewBox="0 0 100 100" class="icon">
          <rect x="0" y="0" width="100" height="100" rx="15" ry="15" />
          <path d="M40,20 l30,30 l-30,30 z" />
        </svg>
        <div>
          <a href="https://www.youtube.com/watch?v=${post.videoid}">${post.title}</a>
          <em>${moment(post.date).format('MMMM Do YYYY')}</em>
        </div>
      </section>
    `
  } else {
    return html`
      <section onclick=${click}>
        <svg viewBox="0 0 100 100" class="icon">
          <rect x="0" y="0" width="100" height="100" rx="15" ry="15" />
          <path d="M10,20 l80,0 M10,40 l80,0 M10,60 l80,0 M10,80 l80,0 z" stroke-width="10" />
        </svg>
        <div>
          <a href="${post.slug}">${post.title}</a>
          <em>${moment(post.date).format('MMMM Do YYYY')}</em>
        </div>
      </section>
    `
  }

  function click (e) {
    e.preventDefault()
    e.stopPropagation()
    emit('transitionTo', post.slug)
  }

  function openvideo (videoid) {
    return function (e) {
      e.preventDefault()
      e.stopPropagation()
      const target = e.currentTarget.querySelector('div')
      const iframe = target.querySelector('iframe')
      if (iframe) {
        target.removeChild(iframe)
      } else {
        target.appendChild(html`<iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoid}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`)
      }
    }
  }
}
