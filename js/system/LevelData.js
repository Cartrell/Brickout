(function(global) {
  global.Brickout = global.Brickout || {};
  
  /////////////////////////////////////////////////////////////////////////////
  // constructor
  /////////////////////////////////////////////////////////////////////////////
  Brickout.LevelData = function(o_jData) {
    o_jData = o_jData || {};
    
    this.tileMapKey = o_jData.tileMapKey;
    this.ballSpeed = o_jData.ballSpeed;
    this.numBricksToClearToDescend = o_jData.numBricksToClearToDescend;
    this.bricksDescensionRate = o_jData.bricksDescensionRate;
  };
})(window);
