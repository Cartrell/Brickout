(function(global) {
  global.Brickout = global.Brickout || {};
  Brickout.PS_BonusPointsEffect = Brickout.PS_BonusPointsEffect || { };
  
  /////////////////////////////////////////////////////////////////////////////
  // public
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // Run
  //---------------------------------------------------------------------------
  Brickout.PS_BonusPointsEffect.Run = function(effectData, iPlayState) {
    addPoints(effectData, iPlayState);
    playCollectSound(effectData);
    showItemLabel(effectData, iPlayState);
    nextBonusPointsIndex(effectData);
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // local
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // addPoints
  //---------------------------------------------------------------------------
  function addPoints(effectData, iPlayState) {
    var u_bonusPointsIndex = Brickout.data.player.bonusPointsIndex;
    var u_points = effectData.props.value * (u_bonusPointsIndex + 1);
    iPlayState.addPoints(u_points);
  }
  
  //---------------------------------------------------------------------------
  // nextBonusPointsIndex
  //---------------------------------------------------------------------------
  function nextBonusPointsIndex(effectData) {
    var playerData = Brickout.data.player;
    var u_bonusPointsIndex = playerData.bonusPointsIndex;
    var a_rankSoundKeys = effectData.props.rankSoundKeys;
    
    if (++u_bonusPointsIndex >= a_rankSoundKeys.length) {
      u_bonusPointsIndex = a_rankSoundKeys.length - 1;
    }
    
    playerData.bonusPointsIndex = u_bonusPointsIndex;
  }
  
  //---------------------------------------------------------------------------
  // playCollectSound
  //---------------------------------------------------------------------------
  function playCollectSound(effectData) {
    var u_bonusPointsIndex = Brickout.data.player.bonusPointsIndex;
    var a_rankSoundKeys = effectData.props.rankSoundKeys;
    Brickout.sndSys.play(a_rankSoundKeys[u_bonusPointsIndex]);
  }
  
  //---------------------------------------------------------------------------
  // showItemLabel
  //---------------------------------------------------------------------------
  function showItemLabel(effectData, iPlayState) {
    var u_bonusPointsIndex = Brickout.data.player.bonusPointsIndex;
    var a_itemLabelSpriteKeys = effectData.props.itemLabelSpriteKeys;
    if (u_bonusPointsIndex < a_itemLabelSpriteKeys.length) {
      Brickout.PS_EffectLabel.RunDirect(a_itemLabelSpriteKeys[u_bonusPointsIndex], iPlayState);
    }
  }
})(window);