(function(global) {
  global.Brickout = global.Brickout || {};
  Brickout.PS_SaverEffect = Brickout.PS_SaverEffect || { };
  
  var BRICK_ADD_RATE_MS = 150;
  
  var bricksToAdd = [];
  var timerEvent = null;
  var brickCreateSound = null;
  
  /////////////////////////////////////////////////////////////////////////////
  // public
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // Run
  //---------------------------------------------------------------------------
  Brickout.PS_SaverEffect.Run = function(effectData, iPlayState) {
    buildBridge(effectData, iPlayState);
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // "local"
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // addBricks
  //---------------------------------------------------------------------------
  function addBricks(effectData, iPlayState) {
    var game = iPlayState.game;
    var gameMap = Brickout.data.gameMap;
    
    var brickData = bricksToAdd.shift();
    var brickEntity = new Brickout.SaverBrickEntity(game, brickData.x, brickData.y, brickData.id,
      effectData.props.minTimePerSaverBlockSec, effectData.props.maxTimePerSaverBlockSec);
    gameMap.saverBricksGroup.add(brickEntity.sprite);
    
    playBrickCreateSound();
    
    if (bricksToAdd.length > 0) {
      timerEvent = game.time.events.add(BRICK_ADD_RATE_MS, onAddBrickTimerComplete, this,
        effectData, iPlayState);
    } else {
      timerEvent = null;
    }
  }
  
  //---------------------------------------------------------------------------
  // buildBridge
  //---------------------------------------------------------------------------
  function buildBridge(effectData, iPlayState) {
    var gameMap = Brickout.data.gameMap;
    var u_tileWidth = gameMap.tileMap.tileWidth;
    var n_y = gameMap.saverLine.y;
    var u_id = 0;
    for (var n_x = gameMap.saverLine.x; n_x < gameMap.saverLine.right; n_x += u_tileWidth, u_id++) {
      
      //Each brick has a unique saver brick ID. Although this returns an array, if the array is empty,
      // proceed, because the brick doesn't exist, and we want to add it
      var a_brickSprites = gameMap.saverBricksGroup.getAll("saverBrickId", u_id);
      if (a_brickSprites.length != 0) {
        continue;
      }
      
      if (isBrickAlreadyBeingAdded(u_id)) {
        continue;
      }
      
      bricksToAdd.push({
        x: n_x,
        y: n_y,
        id: u_id
      });
    }
    
    if (bricksToAdd.length > 0 && timerEvent === null) {
      addBricks(effectData, iPlayState);
    }
  }
  
  //---------------------------------------------------------------------------
  // isBrickAlreadyBeingAdded
  //---------------------------------------------------------------------------
  function isBrickAlreadyBeingAdded(u_id) {
    for (var i_index = 0; i_index < bricksToAdd.length; i_index++) {
      if (bricksToAdd[i_index].id === u_id) {
        return(true);
      }
    }
    return(false);
  }
  
  //---------------------------------------------------------------------------
  // onAddBrickTimerComplete
  //---------------------------------------------------------------------------
  function onAddBrickTimerComplete(effectData, iPlayState) {
    addBricks(effectData, iPlayState);
  }
  
  //---------------------------------------------------------------------------
  // playBrickCreateSound
  //---------------------------------------------------------------------------
  function playBrickCreateSound() {
    if (brickCreateSound !== null) {
      brickCreateSound.play();
      return;
    }
    
    brickCreateSound = Brickout.sndSys.play(Brickout.Sounds.Ids.ITEM_COLLECT_SAVER);
  }
  
})(window);
