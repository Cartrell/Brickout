(function(global) {
  global.Brickout = global.Brickout || {};
  Brickout.PS_EffectLabel = Brickout.PS_EffectLabel || { };
  
  /////////////////////////////////////////////////////////////////////////////
  // public
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // Run
  //---------------------------------------------------------------------------
  Brickout.PS_EffectLabel.Run = function(effectData, iPlayState) {
    var as_itemLabelSpriteKeys = effectData.itemLabelSpriteKeys;
    if (Array.isArray(as_itemLabelSpriteKeys)) {
      this._start(as_itemLabelSpriteKeys, iPlayState);
    }
  };
  
  //---------------------------------------------------------------------------
  // RunDirect
  //---------------------------------------------------------------------------
  Brickout.PS_EffectLabel.RunDirect = function(itemLabelSpriteKeyStringOrArray, iPlayState) {
    var as_itemLabelSpriteKeys;
    if (typeof(itemLabelSpriteKeyStringOrArray) === 'string') {
      as_itemLabelSpriteKeys = [ itemLabelSpriteKeyStringOrArray ];
    } else if (Array.isArray(itemLabelSpriteKeyStringOrArray)) {
      as_itemLabelSpriteKeys = itemLabelSpriteKeyStringOrArray;
    } else {
      return;
    }
    
    this._start(as_itemLabelSpriteKeys, iPlayState);
  };

  /////////////////////////////////////////////////////////////////////////////
  // "private"
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // _createAnimation
  //---------------------------------------------------------------------------
  Brickout.PS_EffectLabel._createAnimation = function(sprite, as_itemLabelSpriteKeys) {
    var FPS = 16;
    var LOOP = true;
    var ANIM_ITEM_LABEL = "animItemLabel";
    sprite.animations.add(ANIM_ITEM_LABEL, as_itemLabelSpriteKeys, FPS, LOOP);
    sprite.animations.play(ANIM_ITEM_LABEL);
  };
  
  //---------------------------------------------------------------------------
  // _createSprite
  //---------------------------------------------------------------------------
  Brickout.PS_EffectLabel._createSprite = function(iPlayState) {
    var n_x = this._getSpriteX(iPlayState);
    var n_y = this._getSpriteY(iPlayState);
    
    var KEY = 'atlas';
    var FRAME = null;
    var sprite = iPlayState.game.add.sprite(n_x, n_y, KEY, FRAME, iPlayState.getUi.group);
    return(sprite);
  };
  
  //---------------------------------------------------------------------------
  // _createMovementTween
  //---------------------------------------------------------------------------
  Brickout.PS_EffectLabel._createMovementTween = function(iPlayState, sprite) {
    var PROPERTIES = {
      y: sprite.y - 50
    };
    
    var DURATION_MS = 750;
    var EASE = Phaser.Easing.Cubic.Out;
    var AUTO_START = true;
    var PRIORITY = null;  
    var tween = iPlayState.game.tweens.create(sprite);
    tween.onComplete.add(this._onTweenComplete, this, PRIORITY, sprite);
    tween.to(PROPERTIES, DURATION_MS, EASE, AUTO_START);
  };
  
  //---------------------------------------------------------------------------
  // _getSpriteX
  //---------------------------------------------------------------------------
  Brickout.PS_EffectLabel._getSpriteX = function(iPlayState) {
    var player = iPlayState.getPlayer();
    return(player.spriteGroup.centerX);
  };
  
  //---------------------------------------------------------------------------
  // _getSpriteY
  //---------------------------------------------------------------------------
  Brickout.PS_EffectLabel._getSpriteY = function(iPlayState) {
    var gameMap = Brickout.data.gameMap;
    return(gameMap.ballStartLine.y);
  };
  
  //---------------------------------------------------------------------------
  // _onTweenComplete
  //---------------------------------------------------------------------------
  Brickout.PS_EffectLabel._onTweenComplete = function(sprite) {
    sprite.destroy();
  }
  
  //---------------------------------------------------------------------------
  // _start
  //---------------------------------------------------------------------------
  Brickout.PS_EffectLabel._start = function(as_itemLabelSpriteKeys, iPlayState) {
    var sprite = this._createSprite(iPlayState);
    this._createAnimation(sprite, as_itemLabelSpriteKeys);
    this._createMovementTween(iPlayState, sprite);
  };
  
})(window);
