(function(global) {
  global.Brickout = global.Brickout || {};
  
  /////////////////////////////////////////////////////////////////////////////
  // constructor
  /////////////////////////////////////////////////////////////////////////////
  Brickout.PS_BricksDescend = function(game) {
    this.game = game;
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // public
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // begin
  //---------------------------------------------------------------------------
  Brickout.PS_BricksDescend.prototype.begin = function(u_numBricksClearedDuringPass) {
    var playerData = Brickout.data.player;
    
    //check if there are more bricks to clear before descending all the bricks
    if (playerData.numBricksToClearToDescend <= 0) {
      return;
    }
    
    playerData.numBricksToClearToDescend -= u_numBricksClearedDuringPass;
    if (playerData.numBricksToClearToDescend > 0) {
      return;
    }

    playerData.brickDescendLevel++;
    
    var u_newNumBricksToClearToDescend =
      Brickout.Utils.CalcNumBricksToClearToDescend(this.game, playerData.level,
        playerData.brickDescendLevel);
    playerData.numBricksToClearToDescend = u_newNumBricksToClearToDescend;

    Brickout.sndSys.play(Brickout.Sounds.Ids.BRICKS_DESCEND);
    this._descend();
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // "private"
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // _descend
  //---------------------------------------------------------------------------
  Brickout.PS_BricksDescend.prototype._descend = function() {
    var SHOULD_CREATE_NEW_ROW = false;
    Brickout.data.gameMap.descend(SHOULD_CREATE_NEW_ROW);
  };
})(window);
