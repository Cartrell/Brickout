(function(global) {
  global.Brickout = global.Brickout || {};
  
  var ANIM_NAME_BOMB = 'bomb';
  var ANIM_NAME_BOMB_WARNING = 'bombWarning';
  var ANIM_NAME_EXPLOSION = 'explosion';
  
  var BOMB_DURATION_MS = 3000;
  var BOMB_WARNING_DURATION_MS = 1500;
  var EXPLOSION_SCALE = 2.5;
  
  var FLASH_DURATION_MS = 50;
  var FLASH_COLOR = 0xff0000;
  var FLASH_ALPHA = 0.5;
  
  var DEBUG_SHOW_EXPL_RECT = false;
  
  /////////////////////////////////////////////////////////////////////////////
  // constructor
  /////////////////////////////////////////////////////////////////////////////
  Brickout.BombEntity = function(game, n_x, n_y, effectData) {
    this.game = game;
    this.effectData = effectData;
    this.sprite = this.game.add.sprite(0, 0, 'atlas');
    this.sprite.entity = this;
    this.flashGraphics = null;
    
    this._createBombAnimation();
    this._createBombWarningAnimation();
    this._createExplosionAnimation();
    
    this.sprite.animations.play(ANIM_NAME_BOMB);
    this.timerEvent = this.game.time.events.add(BOMB_DURATION_MS, this._onBombTimerEventComplete, this);
    
    this.flashTimerEvent = null;
    
    this.x(n_x);
    this.y(n_y);
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // public
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // dispose
  //---------------------------------------------------------------------------
  Brickout.BombEntity.prototype.dispose = function() {
    if (this.timerEvent) {
      this.game.time.events.remove(this.timerEvent);
      this.timerEvent = null;
    }
    
    this.sprite.entity = null;
    this.sprite.destroy();
    this.flashGraphics = Brickout.Utils.DestroyResource(this.flashGraphics);
    
    this.game = null;
  };
  
  //---------------------------------------------------------------------------
  // x
  //---------------------------------------------------------------------------
  Brickout.BombEntity.prototype.x = function(value) {
    if (value === undefined) {
      return(this.sprite.x);
    }
    this.sprite.x = value;
    return(this);
  };
  
  //---------------------------------------------------------------------------
  // y
  //---------------------------------------------------------------------------
  Brickout.BombEntity.prototype.y = function(value) {
    if (value === undefined) {
      return(this.sprite.y);
    }
    this.sprite.y = value;
    return(this);
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // "private"
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // _clearBrickIfInRange
  //---------------------------------------------------------------------------
  Brickout.BombEntity.prototype._clearBrickIfInRange = function(brickSprite, r_explosion,
  a_brickEntitiesToClear_out) {
    var r_body = new Phaser.Rectangle(brickSprite.body.x, brickSprite.body.y,
      brickSprite.body.width, brickSprite.body.height);
    
    if (Brickout.Utils.RectsIntersect(r_explosion, r_body)) {
      a_brickEntitiesToClear_out.push(brickSprite.entity);
    }
  };
  
  //---------------------------------------------------------------------------
  // _clearBricks
  //---------------------------------------------------------------------------
  Brickout.BombEntity.prototype._clearBricks = function() {
    var u_blastHalfSquareRange = this.effectData.props.blastHalfSquareRange || 0;
    if (!u_blastHalfSquareRange || u_blastHalfSquareRange < 0) {
      return;
    }
    
    var gameMap = Brickout.data.gameMap;
    var n_tileWidth = gameMap.tileMap.tileWidth;
    var n_tileHeight = gameMap.tileMap.tileHeight;
    var n_x = this.x();
    var n_y = this.y();
    var r_explosion = new Phaser.Rectangle(
      n_x - u_blastHalfSquareRange * n_tileWidth,
      n_y - u_blastHalfSquareRange * n_tileHeight,
      u_blastHalfSquareRange * 2 * n_tileWidth,
      u_blastHalfSquareRange * 2 * n_tileHeight);
    r_explosion.x = Math.floor(r_explosion.x / n_tileWidth) * n_tileWidth;
    r_explosion.y = Math.floor(r_explosion.y / n_tileHeight) * n_tileHeight;
    
    if (DEBUG_SHOW_EXPL_RECT) {
      this.game.debugRect = r_explosion;
    }
    
    var CHECK_EXISTS = false;
    var a_brickEntitiesToClear = [];
    gameMap.bricksGroup.forEach(this._clearBrickIfInRange, this, CHECK_EXISTS, r_explosion,
      a_brickEntitiesToClear);
      
    if (a_brickEntitiesToClear.length > 0) {
      Brickout.sndSys.play(Brickout.Sounds.Ids.BRICKS_SHATTERED);
      var CREATE_PARTICLES = true;
      gameMap.clearBricks(a_brickEntitiesToClear, CREATE_PARTICLES);
    }
  };
  
  //---------------------------------------------------------------------------
  // _createBombAnimation
  //---------------------------------------------------------------------------
  Brickout.BombEntity.prototype._createBombAnimation = function() {
    var FPS = 8;
    var LOOP = true;
    this.bombAnimation = this.sprite.animations.add(ANIM_NAME_BOMB, ['bomb00','bomb01'], FPS, LOOP);
  };
  
  //---------------------------------------------------------------------------
  // _createBombWarningAnimation
  //---------------------------------------------------------------------------
  Brickout.BombEntity.prototype._createBombWarningAnimation = function() {
    var FPS = 16;
    var LOOP = true;
    this.bombAnimation = this.sprite.animations.add(ANIM_NAME_BOMB_WARNING, ['bomb00', 'bomb03',
      'bomb02', 'bomb01'], FPS, LOOP);
  };
  
  //---------------------------------------------------------------------------
  // _createExplosionAnimation
  //---------------------------------------------------------------------------
  Brickout.BombEntity.prototype._createExplosionAnimation = function() {
    var FPS = 24;
    var LOOP = false;
    this.sprite.anchor.set(0.5);
    
    var tileMap = Brickout.data.gameMap.tileMap;
    this.x(this.x() + tileMap.tileWidth / 2);
    this.y(this.y() + tileMap.tileHeight / 2);
    
    this.explosionAnimation = this.sprite.animations.add(ANIM_NAME_EXPLOSION, ['explosion0','explosion1',
      'explosion2', 'explosion3', 'explosion4', 'explosion5', 'explosion6', 'explosion7', 'explosion8',
      'explosion9'], FPS, LOOP);
    this.explosionAnimation.onComplete.addOnce(this._onExplodeAnimationComplete, this);;
  };
  
  //---------------------------------------------------------------------------
  // _explode
  //---------------------------------------------------------------------------
  Brickout.BombEntity.prototype._explode = function() {
    this.sprite.animations.play(ANIM_NAME_EXPLOSION);
    this.sprite.scale.set(EXPLOSION_SCALE);
    Brickout.sndSys.play(Brickout.Sounds.Ids.BOMB_EXPLODE);
    this._clearBricks();
    
    this._tremor();
    this._flash();
  };
  
  //---------------------------------------------------------------------------
  // _flash
  //---------------------------------------------------------------------------
  Brickout.BombEntity.prototype._flash = function() {
    this.flashGraphics = this.game.add.graphics(0, 0)
    this.flashGraphics.beginFill(FLASH_COLOR, FLASH_ALPHA);
    this.flashGraphics.drawRect(0, 0, this.game.world.width, this.game.world.height);
    this.flashGraphics.endFill();
    
    this.flashTimerEvent = this.game.time.events.add(FLASH_DURATION_MS, this._onFlashTimerEventComplete, this);
  };
  
  //---------------------------------------------------------------------------
  // _onBombTimerEventComplete
  //---------------------------------------------------------------------------
  Brickout.BombEntity.prototype._onBombTimerEventComplete = function() {
    this.sprite.animations.play(ANIM_NAME_BOMB_WARNING);
    this.timerEvent = this.game.time.events.add(BOMB_WARNING_DURATION_MS, this._onBombWarningTimerEventComplete,
      this);
  };
  
  //---------------------------------------------------------------------------
  // _onBombWarningTimerEventComplete
  //---------------------------------------------------------------------------
  Brickout.BombEntity.prototype._onBombWarningTimerEventComplete = function() {
    this._explode();
  };
  
  //---------------------------------------------------------------------------
  // _onExplodeAnimationComplete
  //---------------------------------------------------------------------------
  Brickout.BombEntity.prototype._onExplodeAnimationComplete = function() {
    this.dispose();
  };  
  
  //---------------------------------------------------------------------------
  // _onFlashTimerEventComplete
  //---------------------------------------------------------------------------
  Brickout.BombEntity.prototype._onFlashTimerEventComplete = function() {
    this.flashGraphics = Brickout.Utils.DestroyResource(this.flashGraphics);
  };
  
  //---------------------------------------------------------------------------
  // _tremor
  //---------------------------------------------------------------------------
  Brickout.BombEntity.prototype._tremor = function() {
    //produce screen tremor - bombs are some serious shit
    var INTENSITY_PX = 8;
    Brickout.Utils.Tremor(this.game.camera, INTENSITY_PX);
  };
})(window);