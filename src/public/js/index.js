var $ = require('jquery-browserify');
var _ = require('lodash');
var createAtlas = require('atlaspack');

function Website() {
  this.atlas = null;
  this.init();
}

Website.prototype.packbox = function(box) {
  var self = this;
  var rect = {w: $(box).outerWidth(true), h: $(box).outerHeight(true)};
  var node = self.atlas.pack(rect);
  if (node === false) {
    self.atlas = self.atlas.expand(rect);
    node = self.atlas.right;
    $('article.main').width(self.atlas.rect.w).height(self.atlas.rect.h);
  }
  $(box).css({
    left: node.rect.x,
    top: node.rect.y
  });
};

Website.prototype.loadbox = function(box, done) {
  var url = $(box).data('url');
  if (!url) return done();
  $(box).html('Loading...');
  $.get(url, function(html) {
    $(box).html(html);
    done();
  });
};

// pack sections
Website.prototype.packsections = function() {
  var self = this;
  self.atlas = createAtlas(100, 100);
  $('article.main').find('section').each(function() {
    var box = this;
    $(box).addClass('loading');
    self.loadbox(box, function() {
      $(box).removeClass('loading');
      self.packbox(box);
    });
  });
};

// if error 404 page
Website.prototype.error404 = function() {
  var self = this;
  if (!$('body').hasClass('body-404')) return;
  var count = 0;
  (function loop() {
    console.log('jhgjh')
    var w = Math.random() * 200;
    var h = Math.random() * 200;
    var div = $('<div/>').width(w).height(h).html('nhgjhgjg').css({border: '2px solid gray'});
    $('article.main').append(div);
    self.packbox(div);
    count++;
    if (count < 50) setTimeout(loop, 1000);
  }());
};

// init website
Website.prototype.init = function() {
  var self = this;
  self.packsections();
  $(window).on('resize', _.debounce(self.packsections.bind(self), 300));
  //self.error404();
};

new Website();
