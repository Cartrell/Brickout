(function(global) {
  global.Brickout = global.Brickout || {};
  
  /////////////////////////////////////////////////////////////////////////////
  // constructor
  /////////////////////////////////////////////////////////////////////////////
  Brickout.ItemData = function(s_itemId, jData) {
    jData = jData || {};
    
    this.id = s_itemId;
    this.brickKey = jData.brickKey;
    this.imageFrames = jData.imageFrames;
    this.effect = new Brickout.EffectData(s_itemId, jData.props, jData.itemLabelSpriteKeys);
    this.itemCollectSoundKey = jData.itemCollectSoundKey;
  };
})(window);
