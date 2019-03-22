(function(global) {
  global.Brickout = global.Brickout || {};
  Brickout.PS_ColorMatchEffect = Brickout.PS_ColorMatchEffect || { };
  
  var m_bricksClearer = null;
  
  /////////////////////////////////////////////////////////////////////////////
  // public
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // Run
  //---------------------------------------------------------------------------
  Brickout.PS_ColorMatchEffect.Run = function(effectData, iPlayState) {
    if (Brickout.data.player.containsEffect(effectData.itemId)) {
      return;
    }
    
    var newEffectData = Brickout.data.player.addEffect(effectData);
    
    if (!m_bricksClearer) {
      m_bricksClearer = new Brickout.PS_SequentialBricksClearer(iPlayState);
    }
    
    newEffectData.onPlayerBallCollide = onPlayerBallCollide;
    newEffectData.onBallClearedBrick = onBallClearedBrick;
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // "local"
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // getAllBricksOf
  //---------------------------------------------------------------------------
  function getAllBricksOf(s_brickFrame) {
    var gameMap = Brickout.data.gameMap;
    var a_brickEntities = [];
    
    var f_onBrick = function(brickSprite) {
      var brickEntity = brickSprite.entity;
      if (brickEntity.frame === s_brickFrame) {
        a_brickEntities.push(brickEntity);
      } 
    };
    
    gameMap.bricksGroup.forEach(f_onBrick, this);
    return(a_brickEntities);
  }
    
  //---------------------------------------------------------------------------
  // onBallClearedBrick
  //---------------------------------------------------------------------------
  function onBallClearedBrick(ballEntity, brickEntity) {
    var effectData = ballEntity.colorMatchingEffect;
    if (!effectData) {
      return;
    }
    
    var a_brickEntities = getAllBricksOf(brickEntity.frame);
    m_bricksClearer.start(a_brickEntities);
    
    Brickout.data.player.removeEffectData(effectData);
    ballEntity.colorMatchingEffect = null;
  }
  
  //---------------------------------------------------------------------------
  // onPlayerBallCollide
  //---------------------------------------------------------------------------
  function onPlayerBallCollide(ballEntity) {
    if (this.ballEntity === undefined) {
      ballEntity.colorMatchingEffect = this;
      this.ballEntity = ballEntity;
    }
  }
  
})(window);
