(function(global) {
  global.Brickout = global.Brickout || {};
  Brickout.OutroState = {};
  
  var m_blackout = null;
  
  /////////////////////////////////////////////////////////////////////////////
  // create
  /////////////////////////////////////////////////////////////////////////////
  Brickout.OutroState.create = function() {
    tintDisplays();
    createBlackout();
    Brickout.sndSys.play(Brickout.Sounds.Ids.GAME_OVER, onGameOverSoundStop, this);
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // "local"
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // changeDisplayTint
  //---------------------------------------------------------------------------
  function changeDisplayTint(displayObjectContainer, u_tintColor) {
    displayObjectContainer.tint = u_tintColor;
    if (displayObjectContainer instanceof PIXI.DisplayObjectContainer) {
      for (var u_index = 0; u_index < displayObjectContainer.children.length; u_index++) {
        var displayObject = displayObjectContainer.children[u_index];
        displayObject.tint = u_tintColor;
      }
    }
  }
  
  //---------------------------------------------------------------------------
  // changeBricksTint
  //---------------------------------------------------------------------------
  function changeBricksTint(gameMap) {
    for (var u_index = 0; u_index < gameMap.bricksGroup.children.length; u_index++) {
      var brickSprite = gameMap.bricksGroup.children[u_index];
      var brickEntity = brickSprite.entity;
      brickEntity.setUDed(true);
    }
  }
  
  //---------------------------------------------------------------------------
  // createBlackout
  //---------------------------------------------------------------------------
  function createBlackout() {
    var BLACKOUT_COLOR = 0x000000;
    m_blackout = Brickout.OutroState.game.add.graphics();
    m_blackout.beginFill(BLACKOUT_COLOR, 0.5);
    m_blackout.drawRect(0, 0, Brickout.OutroState.game.width, Brickout.OutroState.game.height);
    m_blackout.endFill();
  }
  
  //---------------------------------------------------------------------------
  // onGameOverSoundStop
  //---------------------------------------------------------------------------
  function onGameOverSoundStop() {
    Brickout.OutroState.game.state.start("IntroState");
  }
  
  //---------------------------------------------------------------------------
  // tintDisplays
  //---------------------------------------------------------------------------
  function tintDisplays() {
    var TINT_COLOR = 0xff0000;
    changeDisplayTint(Brickout.OutroState.game.world, TINT_COLOR);
    changeBricksTint(Brickout.data.gameMap);
  }
  
})(window);