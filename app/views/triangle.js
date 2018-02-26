const html = require('yo-yo')

module.exports = function (state, emit) {
  return html`
    <svg viewBox="0 0 105 100" class="triangle">
      <symbol id="triangle">
        <path d="M 4,100 l 45,-96 l 25,48 l -10,10 l 30,6 l -6,10 l 12,22 Z" stroke-width="2" />
      </symbol>
      <use class="blue" id="blue" xlink:href="#triangle" />
      <animateTransform xlink:href="#blue"
        attributeName="transform"
        type="translate"
        from="-1" to="-1"
        values="-1;-4;-1"
        keyTimes="0;.5;1"
        begin="0s" dur="20s" repeatCount="indefinite"
      />
      <use class="green" id="green" xlink:href="#triangle" />
      <animateTransform xlink:href="#green"
        attributeName="transform"
        type="translate"
        from="1 -1" to="1 -1"
        values="1 -1;1 -4;1 -1"
        keyTimes="0;.5;1"
        begin="0s" dur="20s" repeatCount="indefinite"
      />
      <use class="red" id="red" xlink:href="#triangle" />
      <animateTransform xlink:href="#red"
        attributeName="transform"
        type="translate"
        from="1" to="1"
        values="1;4;1"
        keyTimes="0;.5;1"
        begin="0s" dur="20s" repeatCount="indefinite"
      />
      <use class="base" xlink:href="#triangle" />
    </svg>
  `
}
