(function(global) {
  global.Brickout = global.Brickout || {};
  Brickout.PS_BlitzBallEffect = Brickout.PS_BlitzBallEffect || { };
  
  var m_timerEvent = null;
  var m_effectData;
  var m_iPlayState;
  
  /////////////////////////////////////////////////////////////////////////////
  // public
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // Run
  //---------------------------------------------------------------------------
  Brickout.PS_BlitzBallEffect.Run = function(effectData, iPlayState) {
    m_iPlayState = iPlayState;
    removeBlitzEffect();
    addBlitzEffect(effectData);
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // "local"
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // addBlitzEffect
  //---------------------------------------------------------------------------
  function addBlitzEffect(effectData) {
    m_effectData = Brickout.data.player.addEffect(effectData);
    setBallsToBlitz();
    startTimer(m_effectData.props.duration);
  }
  
  //---------------------------------------------------------------------------
  // getPlayerOwnedBallEntities
  //---------------------------------------------------------------------------
  function getPlayerOwnedBallEntities() {
    var ballsGroup = m_iPlayState.getBallsGroup();
    var a_ballEntities = [];
    
    var f_callback = function(ballSprite) {
      var ballEntity = ballSprite.entity;
      if (ballEntity.doesPlayerOwn) {
        a_ballEntities.push(ballEntity);
      }
    };
    
    ballsGroup.forEach(f_callback, this);
    return(a_ballEntities);
  }
  
  //---------------------------------------------------------------------------
  // onTimerEventComplete
  //---------------------------------------------------------------------------
  function onTimerEventComplete() {
    removeBlitzEffect();
  }
  
  //---------------------------------------------------------------------------
  // removeBlitzEffect
  //---------------------------------------------------------------------------
  function removeBlitzEffect() {
    if (m_effectData) {
      Brickout.data.player.removeEffects(m_effectData.itemId);
      m_effectData = null;
    }
    
    setBallsToNormal();
    stopTimer();
  }
  
  //---------------------------------------------------------------------------
  // setBallsToBlitz
  //---------------------------------------------------------------------------
  function setBallsToBlitz() {
    var a_playerOwnedBallEntites = getPlayerOwnedBallEntities();
    for (var i_index = 0; i_index < a_playerOwnedBallEntites.length; i_index++) {
      var ballEntity = a_playerOwnedBallEntites[i_index];
      setBallToBlitz(ballEntity);
    }
  }
  
  //---------------------------------------------------------------------------
  // setBallsToNormal
  //---------------------------------------------------------------------------
  function setBallsToNormal() {
    var a_playerOwnedBallEntites = getPlayerOwnedBallEntities();
    for (var i_index = 0; i_index < a_playerOwnedBallEntites.length; i_index++) {
      var ballEntity = a_playerOwnedBallEntites[i_index];
      setBallToNormal(ballEntity);
    }
  }
  
  //---------------------------------------------------------------------------
  // setBallToBlitz
  //---------------------------------------------------------------------------
  function setBallToBlitz(ballEntity) {
    Brickout.sndSys.play(Brickout.Sounds.Ids.ITEM_COLLECT_BLITZ_BALL);
    ballEntity.setBlitz(true);
  }
  
  //---------------------------------------------------------------------------
  // setBallToNormal
  //---------------------------------------------------------------------------
  function setBallToNormal(ballEntity) {
    ballEntity.setBlitz(false);
  }
  
  //---------------------------------------------------------------------------
  // startTimer
  //---------------------------------------------------------------------------
  function startTimer(n_effectDurationInSecs) {
    if (!n_effectDurationInSecs) {
      return;
    }
    
    var n_ms = n_effectDurationInSecs * 1000;
    m_timerEvent = m_iPlayState.game.time.events.add(n_ms, onTimerEventComplete, this);
  }
  
  //---------------------------------------------------------------------------
  // stopTimer
  //---------------------------------------------------------------------------
  function stopTimer() {
    if (m_timerEvent) {
      m_iPlayState.game.time.events.remove(m_timerEvent);
      m_timerEvent = null;
    }
  }  
})(window);