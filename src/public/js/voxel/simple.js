var createGame = require('voxel-engine');

var game = createGame({
  chunkDistance: 2,
  generate: function(x, y, z) {
    return (Math.sqrt(x*x + y*y + z*z) > 20 || y*y > 10) ? 0 : (Math.random() * 3) + 1;
  },
  materials: ['brick', ['grass', 'dirt', 'grass_dirt'], 'dirt'],
  texturePath: '/images/voxel/textures/'
});
var container = document.getElementById('voxel');
game.appendTo(container);

// create a player
var createPlayer = require('voxel-player')(game);
var shama = createPlayer('/images/voxel/textures/shama.png');
shama.yaw.position.set(0, 10, 0);
shama.possess();

// resize to fit element
game.view.resizeWindow(770, 533);
