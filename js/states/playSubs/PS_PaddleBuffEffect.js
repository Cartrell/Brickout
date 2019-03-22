(function(global) {
  global.Brickout = global.Brickout || {};
  Brickout.PS_PaddleBuffEffect = Brickout.PS_PaddleBuffEffect || { };
  
  var PROP_MAX_HITS = "maxHits";
  var PROP_MIN_HITS = "minHits";
  var PROP_NUM_HITS_REMAINING = "numHitsRemaining";
  
  /////////////////////////////////////////////////////////////////////////////
  // public
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // GetNumHitsRemaining
  //---------------------------------------------------------------------------
  Brickout.PS_PaddleBuffEffect.GetNumHitsRemaining = function(effectData) {
    return(effectData.props[PROP_NUM_HITS_REMAINING]);
  };
  
  //---------------------------------------------------------------------------
  // Run
  //---------------------------------------------------------------------------
  Brickout.PS_PaddleBuffEffect.Run = function(effectData, iPlayState) {
    removeExistingPaddleEffects();
    addNewPaddleBuff(effectData, iPlayState);
  };
  
  //---------------------------------------------------------------------------
  // SetNumHitsRemaining
  //---------------------------------------------------------------------------
  Brickout.PS_PaddleBuffEffect.SetNumHitsRemaining = function(effectData, u_value) {
    effectData.props[PROP_NUM_HITS_REMAINING] = u_value;
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // "local"
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // addNewPaddleBuff
  //---------------------------------------------------------------------------
  function addNewPaddleBuff(effectData, iPlayState) {
    initEffect(effectData, iPlayState);
    
    var u_newBodySize = calcNewBodySize(effectData, iPlayState);
    setPlayerSize(u_newBodySize, iPlayState);
  }
  
  //---------------------------------------------------------------------------
  // calcNewBodySize
  //---------------------------------------------------------------------------
  function calcNewBodySize(effectData, iPlayState) {
    if (effectData.itemId === Brickout.Items.Keys.PADDLE_BUFF) {
      //paddle buff always adds one more onto current body size
      var player = iPlayState.getPlayer();
      return(player.bodySize + 1);
    }
    
    //paddle nerf always sets body size to 1 (smallest body size allowed)
    return(1);
  }
    
  //---------------------------------------------------------------------------
  // getMaxHits
  //---------------------------------------------------------------------------
  function getMaxHits(effectData) {
    return(effectData.props[PROP_MAX_HITS]);
  }
  
  //---------------------------------------------------------------------------
  // getMinHits
  //---------------------------------------------------------------------------
  function getMinHits(effectData) {
    return(effectData.props[PROP_MIN_HITS]);
  }
  
  //---------------------------------------------------------------------------
  // initEffect
  //---------------------------------------------------------------------------
  function initEffect(effectData, iPlayState) {
    var playerData = Brickout.data.player;
    var newEffectData = playerData.addEffect(effectData);
    var u_minHits = getMinHits(newEffectData);
    var u_maxHits = getMaxHits(newEffectData);
    var u_numHits = iPlayState.game.rnd.between(u_minHits, u_maxHits);
    Brickout.PS_PaddleBuffEffect.SetNumHitsRemaining(newEffectData, u_numHits);
  }
  
  //---------------------------------------------------------------------------
  // removeExistingPaddleEffects
  //---------------------------------------------------------------------------
  function removeExistingPaddleEffects() {
    var playerData = Brickout.data.player;
    playerData.removeEffects(Brickout.Items.Keys.PADDLE_BUFF, Brickout.Items.Keys.PADDLE_NERF);
  }
  
  //---------------------------------------------------------------------------
  // setPlayerSize
  //---------------------------------------------------------------------------
  function setPlayerSize(u_newBodySize, iPlayState) {
    var player = iPlayState.getPlayer();
    player.setBodySize(u_newBodySize);
  }
})(window);
