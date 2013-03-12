var html = require('./template');

function getHtml() { return html; }

function setup() {
  var colorIndex = 0;
  var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

  var block = document.getElementById('color-block');
  var btn = document.getElementById('color-change');
  btn.onclick = function () {
    colorIndex = (colorIndex + 1) % colors.length;
    block.style.backgroundColor = colors[colorIndex];
  }
}

module.exports = {
  getHtml: getHtml,
  setup: setup
};
