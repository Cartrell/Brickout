(function(global) {
  global.Brickout = global.Brickout || {};
  
  /////////////////////////////////////////////////////////////////////////////
  // constructor
  /////////////////////////////////////////////////////////////////////////////
  Brickout.SoundData = function(s_soundId, jData) {
    jData = jData || {};
    this.id = s_soundId;
    this.assetKeys = jData.assetKeys;
  };
})(window);
