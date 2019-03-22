(function(global) {
  global.Brickout = global.Brickout || {};
  Brickout.PS_BombEffect = Brickout.PS_BombEffect || { };
  
  var m_effectData;
  
  /////////////////////////////////////////////////////////////////////////////
  // public
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // Run
  //---------------------------------------------------------------------------
  Brickout.PS_BombEffect.Run = function(effectData, iPlayState) {
    _createBomb(effectData, iPlayState);
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // "local"
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // _createBomb
  //---------------------------------------------------------------------------
  function _createBomb(effectData, iPlayState) {
    var bombLocation = _getRandomBombLocation();
    var bomb = new Brickout.BombEntity(iPlayState.game, bombLocation.x, bombLocation.y, effectData);
  }
  
  //---------------------------------------------------------------------------
  // _getRandomBombLocation
  //---------------------------------------------------------------------------
  function _getRandomBombLocation() {
    var gameMap = Brickout.data.gameMap;
    var u_tileWidth = gameMap.tileMap.tileWidth;
    var u_tileHeight = gameMap.tileMap.tileHeight;
    var bricksAreaRect = new Phaser.Rectangle(
      gameMap.bricksStartLine.x, gameMap.bricksStartLine.y,
      gameMap.bricksStartLine.width, gameMap.bricksBottom - gameMap.bricksStartLine.y);
    var i_x = Math.floor(bricksAreaRect.randomX / u_tileWidth) * u_tileWidth;
    var i_y = Math.floor(bricksAreaRect.randomY / u_tileHeight) * u_tileHeight;
    return(new Phaser.Point(i_x, i_y));
  }
})(window);
