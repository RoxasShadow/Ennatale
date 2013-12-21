document.addEventListener('DOMContentLoaded', init, false);

var stage, renderer, interactive, interval;
var assetsToLoader, loader, explosions;

function init() {
  interactive = true;
  stage       = new PIXI.Stage(0xFFFFFF, interactive);
  renderer    = PIXI.autoDetectRenderer(640, 480, null, true);
  document.body.appendChild(renderer.view)

  interval   = 1000;
  add();
  setInterval(function() { add(); }, interval);

  assetsToLoader    = [ 'SpriteSheet.json' ]
  loader            = new PIXI.AssetLoader(assetsToLoader);
  loader.onComplete = onAssetsLoaded;
  loader.load();

  requestAnimFrame(update);
}

function add() {
  var deliTexture = PIXI.Texture.fromImage('delibird.png');
  var delibird    = new PIXI.Sprite(deliTexture);
  delibird.setInteractive(true);
  delibird.position.x = Math.random() * 640;
  delibird.position.y = Math.random() * 480;
  delibird.anchor.x   = 0.5;
  delibird.anchor.y   = 0.5;
  delibird.click = onClick;
  stage.addChild(delibird);
}

function onAssetsLoaded() {
  explosions = [];

  for(var i = 0; i < 26; ++i) {
    var texture = PIXI.Texture.fromFrame("Explosion_Sequence_A " + (i+1) + ".png");
    explosions.push(texture);
  }
}

function onClick(mouseData) {
  var sprite = this;

  var explosion        = new PIXI.MovieClip(explosions);
  explosion.position.x = sprite.position.x;
  explosion.position.y = sprite.position.y;
  explosion.anchor.x   = 0.5;
  explosion.anchor.y   = 0.5;
  
  explosion.rotation = Math.random() * Math.PI;
  explosion.scale.x  = explosion.scale.y = 0.75 + Math.random() * 0.5
  
  explosion.gotoAndPlay(Math.random() * 27);
  
  stage.addChild(explosion);
  setInterval(function() { stage.removeChild(explosion); }, 700);
  setInterval(function() { stage.removeChild(sprite); }, 1000);
}

function update() {
  renderer.render(stage);
  requestAnimFrame(update);
}