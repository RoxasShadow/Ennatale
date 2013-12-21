document.addEventListener('DOMContentLoaded', init, false);

var width, height, maxWidth, maxHeight;
var stage, renderer, interactive, interval, pause, sprites, spritesLen, gravity;
var assetsToLoader, loader, explosions;

PIXI.DisplayObjectContainer.prototype.contains = function(child) {
  return (this.children.indexOf(child) !== -1);
}

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}

function init() {
  interactive = true;
  width       = window.screen.width;
  height      = window.screen.availHeight;
  maxWidth    = width - 64;
  maxHeight   = height - 128;
  stage       = new PIXI.Stage(0xFFFFFF, interactive);
  renderer    = PIXI.autoDetectRenderer(width, height, null, true);
  document.body.appendChild(renderer.view)

  sprites    = [];
  spritesLen = 0;
  gravity    = 0.5;
  interval   = getURLParameter('interval') || 1000;
  add();
  setInterval(function() { add(); }, interval);

  assetsToLoader    = [ 'SpriteSheet.json' ]
  loader            = new PIXI.AssetLoader(assetsToLoader);
  loader.onComplete = onAssetsLoaded;
  loader.load();

  requestAnimFrame(update);
}

function add() {
  var image       = getURLParameter('sprite') || 'delibird'
  var deliTexture = PIXI.Texture.fromImage('res/' + image + '.png');
  var delibird    = new PIXI.Sprite(deliTexture);
  delibird.setInteractive(true);
  delibird.position.x = Math.random() * width;
  delibird.position.y = Math.random() * height;
  delibird.speedX     =  Math.random() * 5;
  delibird.speedY     = (Math.random() * 10)-5;
  delibird.anchor.x   = 0.5;
  delibird.anchor.y   = 0.5;
  delibird.click      = onClick;
  stage.addChild(delibird);
  spritesLen += 1;
  sprites.push(delibird);
}

function onAssetsLoaded() {
  explosions = [];

  for(var i = 0; i < 26; ++i) {
    var texture = PIXI.Texture.fromFrame('Explosion_Sequence_A ' + (i + 1) + '.png');
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
  updateCounter();
  setInterval(function() { stage.removeChild(explosion); }, 400);
  setInterval(function() { stage.removeChild(sprite);    }, 410);
}

function updateCounter() {
  var counter = document.getElementById('counter').innerHTML;
  document.getElementById('counter').innerHTML = parseInt(counter) + 1;
}

function clearSprites() {
  var tmp = [];
  for(var i = 0; i < spritesLen; ++i)
    if(stage.contains(sprites[i]))
      tmp.push(sprites[i]);
  spritesLen = tmp.length;
  sprites    = tmp;
}

var right = true;
var up    = true
function update() {
  clearSprites();

  for(var i = 0; i < spritesLen; ++i) {
    var sprite = sprites[i];
    sprite.position.x += sprite.speedX;
    sprite.position.y += sprite.speedY;
    sprite.speedY     += gravity;

    if(sprite.position.x > maxWidth) {
      sprite.speedX *= -1;
      sprite.position.x = maxWidth;
    }
    else if(sprite.position.x < 0) {
      sprite.speedX *= -1;
      sprite.position.x = 0;
    }
    
    if(sprite.position.y > maxHeight) {
      sprite.speedY *= -0.85;
      sprite.position.y = maxHeight;
      sprite.spin = (Math.random()-0.5) * 0.2
      if(Math.random() > 0.5)
        sprite.speedY -= Math.random() * 6;
    } 
    else if(sprite.position.y < 0) {
      sprite.speedY = 0;
      sprite.position.y = 0;
    }
  }

  renderer.render(stage);
  requestAnimFrame(update);
}