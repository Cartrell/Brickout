(function(global) {
  global.Brickout = global.Brickout || {};
  
  /////////////////////////////////////////////////////////////////////////////
  // constructor
  /////////////////////////////////////////////////////////////////////////////
  Brickout.PS_LevelBuilder = function(iPlayState, tilemapGroup) {
    this.iPlayState = iPlayState;
    this.tilemapGroup = tilemapGroup;
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // public
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // dispose
  //---------------------------------------------------------------------------
  Brickout.PS_LevelBuilder.prototype.dispose = function() {
    this.iPlayState = null;
    this.tilemapGroup = null;
  };
  
  //---------------------------------------------------------------------------
  // setLevel
  //---------------------------------------------------------------------------
  Brickout.PS_LevelBuilder.prototype.setLevel = function(u_level) {
    var game = this.iPlayState.game;
    var levelData = Brickout.Levels.GetData(game, u_level);
    if (levelData === null) {
      return(false);
    }
     
    if (Brickout.data.gameMap === null) {
      Brickout.data.gameMap = new Brickout.GameMap(game, levelData.tileMapKey, this.tilemapGroup,
        this.iPlayState.getUi());
      this.tilemapGroup.add(Brickout.data.gameMap.bricksGroup);
      this.tilemapGroup.add(Brickout.data.gameMap.saverBricksGroup);
    }
    
    u_mapLevel = Math.max(u_level, 0) % Brickout.data.gameMap.levelLayers.length;
    var playerData = Brickout.data.player;
    playerData.numBricksToClearToDescend = Brickout.Utils.CalcNumBricksToClearToDescend(this.game,
      u_mapLevel, playerData.brickDescendLevel);
    
    Brickout.data.gameMap.createBricks(u_mapLevel);
    this._updateBallsSpeed(levelData);
    return(true);
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // "private"
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // _updateBallsSpeed
  //---------------------------------------------------------------------------
  Brickout.PS_LevelBuilder.prototype._updateBallsSpeed = function(levelData) {
    var a_balls = this.iPlayState.getBallsGroup().children;
    for (var i_index = 0; i_index < a_balls.length; i_index++) {
      var ball = a_balls[i_index];
      ball.entity.setSpeed(levelData.ballSpeed);
    }
  };
})(window);