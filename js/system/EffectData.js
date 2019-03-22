(function(global) {
  global.Brickout = global.Brickout || {};
  
  /////////////////////////////////////////////////////////////////////////////
  // constructor
  /////////////////////////////////////////////////////////////////////////////
  Brickout.EffectData = function(s_itemId, props, itemLabelSpriteKeys) {
    this.props = props || { };
    this.itemId = s_itemId;
    this.itemLabelSpriteKeys = itemLabelSpriteKeys;
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // public
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // clone
  //---------------------------------------------------------------------------
  Brickout.EffectData.prototype.clone = function() {
    return(new Brickout.EffectData(
      this.itemId,
      _.clone(this.props),
      this.itemLabelSpriteKeys));
  };
  
  //---------------------------------------------------------------------------
  // startTimer
  //---------------------------------------------------------------------------
  Brickout.EffectData.prototype.startTimer = function(game, f_callback, callbackContext) {
    if (game && this.duration) {
      this.timerEvent = game.time.events.add(this.duration, f_callback, callbackContext, this);
    }
  };  
})(window);
