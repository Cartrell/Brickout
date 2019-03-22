(function(global) {
  global.Brickout = global.Brickout || {};
  
  /////////////////////////////////////////////////////////////////////////////
  // constructor
  /////////////////////////////////////////////////////////////////////////////
  Brickout.PS_Background = function(game, backgroundGroup) {
    this.game = game;
    this.backgroundGroup = backgroundGroup;
    this.tileSprites = [];
    this.timerEvent = null;
    this.fadeInTween = null;
    this.colors = Phaser.Color.HSVColorWheel();
    this.colorIndex = 0;
    this.tileSpriteIndex = 0;
    this.isFirstBackground = true;
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // static / const
  /////////////////////////////////////////////////////////////////////////////
  Brickout.PS_Background._UPDATE_RATE_MS = Phaser.Timer.SECOND;
  Brickout.PS_Background._COLOR_INDEX_OFFSET = 1;
  Brickout.PS_Background._COLOR_MAX_INDEX = 359;
  Brickout.PS_Background._CROSSFADE_DURATION_MS = Phaser.Timer.SECOND * 10;
  
  /////////////////////////////////////////////////////////////////////////////
  // public
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // dispose
  //---------------------------------------------------------------------------
  Brickout.PS_Background.prototype.dispose = function() {
    if (!this.game) {
      return;
    }
    
    this.backgroundGroup = Brickout.Utils.DestroyGroup(this.backgroundGroup);
    
    this.tileSprites[0] = Brickout.Utils.DestroyResource(this.tileSprites[0]);
    this.tileSprites[1] = Brickout.Utils.DestroyResource(this.tileSprites[1]);
    
    if (this.timerEvent) {
      this.game.time.events.remove(this.timerEvent);
      this.timerEvent = null;
    }
    
    this.game = null;
  };
  
  //---------------------------------------------------------------------------
  // setRandomBackground
  //---------------------------------------------------------------------------
  Brickout.PS_Background.prototype.setRandomBackground = function() {
    if (this.fadeInTween != null) {
      return;
    }
    
    var backgroundId = Brickout.Utils.GetRandomBackgroundId();
    var tileSprite = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'atlas',
      backgroundId, this.backgroundGroup);
    
    if (this.isFirstBackground) {
      this.isFirstBackground = false;
      this._setTileSpriteAt(tileSprite, this.tileSpriteIndex);
    } else {
      tileSprite.alpha = 0;
      this.tileSpriteIndex = (this.tileSpriteIndex + 1) % 2;
      this._setTileSpriteAt(tileSprite, this.tileSpriteIndex);
      this._fadeInActiveTileSprite();
    }
    
    this._updateActiveTileSpriteTint();
  };
  
  //---------------------------------------------------------------------------
  // start
  //---------------------------------------------------------------------------
  Brickout.PS_Background.prototype.start = function() {
    this.timerEvent = this.game.time.events.loop(Brickout.PS_Background._UPDATE_RATE_MS,
      this._onUpdateTimerEvent, this);
    this.colorIndex = Math.floor(Math.random() * Brickout.PS_Background._COLOR_MAX_INDEX);
    
    this._getTileSpriteAt(this.tileSpriteIndex).tint = this.colors[this.colorIndex].color;
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // "private"
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // _fadeInActiveTileSprite
  //---------------------------------------------------------------------------
  Brickout.PS_Background.prototype._fadeInActiveTileSprite = function() {
    this.fadeInTween = this.game.tweens.create(this._getTileSpriteAt(this.tileSpriteIndex));
    this.fadeInTween.onComplete.addOnce(this._onFadeInTweenComplete, this);
    
    var properties = {
      alpha: 1.0
    };
    var duration  = Brickout.PS_Background._CROSSFADE_DURATION_MS;
    var ease = undefined;
    var autoStart = true;
    this.fadeInTween.to(properties, duration, ease, autoStart);
  };
  
  //---------------------------------------------------------------------------
  // _getTileSpriteAt
  //---------------------------------------------------------------------------
  Brickout.PS_Background.prototype._getTileSpriteAt = function(index) {
    return(this.tileSprites[index]);
  };
  
  //---------------------------------------------------------------------------
  // _onFadeInTweenComplete
  //---------------------------------------------------------------------------
  Brickout.PS_Background.prototype._onFadeInTweenComplete = function() {
    var u_prevTileSpriteIndex = (this.tileSpriteIndex + 1) % 2;
    var tileSprite = this._getTileSpriteAt(u_prevTileSpriteIndex);
    this._setTileSpriteAt(Brickout.Utils.DestroyResource(tileSprite), u_prevTileSpriteIndex);
    this.fadeInTween = null;
  };
  
  //---------------------------------------------------------------------------
  // _onUpdateTimerEvent
  //---------------------------------------------------------------------------
  Brickout.PS_Background.prototype._onUpdateTimerEvent = function() {
    this.colorIndex = this.game.math.wrapValue(this.colorIndex,
      Brickout.PS_Background._COLOR_INDEX_OFFSET, Brickout.PS_Background._COLOR_MAX_INDEX);
    this._updateActiveTileSpriteTint();
  };
  
  //---------------------------------------------------------------------------
  // _setTileSpriteAt
  //---------------------------------------------------------------------------
  Brickout.PS_Background.prototype._setTileSpriteAt = function(tileSprite, index) {
    this.tileSprites[index] = tileSprite;
  };
  
  //---------------------------------------------------------------------------
  // _updateActiveTileSpriteTint
  //---------------------------------------------------------------------------
  Brickout.PS_Background.prototype._updateActiveTileSpriteTint = function() {
    this._getTileSpriteAt(this.tileSpriteIndex).tint = this.colors[this.colorIndex].color;
  }
  
})(window);