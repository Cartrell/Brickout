(function(global) {
  global.Brickout = global.Brickout || {};
  Brickout.PS_SpeedEffect = Brickout.PS_SpeedEffect || { };
  
  var m_timerEvent = null;
  var m_effectData;
  
  /////////////////////////////////////////////////////////////////////////////
  // public
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // Run
  //---------------------------------------------------------------------------
  Brickout.PS_SpeedEffect.Run = function(effectData, iPlayState) {
    removeExistingSpeedEffects(iPlayState);
    addSpeedEffect(effectData, iPlayState);
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // "local"
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // addSpeedEffect
  //---------------------------------------------------------------------------
  function addSpeedEffect(effectData, iPlayState) {
    if (!effectData) {
      return;
    }
    
    m_effectData = Brickout.data.player.addEffect(effectData);
    updateBallsSpeed(iPlayState, m_effectData.props.value);
    startTimer(iPlayState, m_effectData.props.duration);
  }

  //---------------------------------------------------------------------------
  // onBallUpdateSpeed
  //---------------------------------------------------------------------------
  function onBallUpdateSpeed(ballSprite, n_speedMultiplier) {
    var ballEntity = ballSprite.entity;
    if (ballEntity) {
      ballEntity.setSpeedMultiplier(n_speedMultiplier);
    }
  }
  
  //---------------------------------------------------------------------------
  // onTimerEventComplete
  //---------------------------------------------------------------------------
  function onTimerEventComplete(iPlayState) {
    removeThisEffect(iPlayState);
  }
  
  //---------------------------------------------------------------------------
  // removeExistingSpeedEffects
  //---------------------------------------------------------------------------
  function removeExistingSpeedEffects(iPlayState) {
    removeThisEffect(iPlayState);
    Brickout.data.player.removeEffects(Brickout.Items.Keys.SPEED_DOWN, Brickout.Items.Keys.SPEED_UP);
  }

  //---------------------------------------------------------------------------
  // removeThisEffect
  //---------------------------------------------------------------------------
  function removeThisEffect(iPlayState) {
    if (m_effectData) {
      Brickout.data.player.removeEffects(m_effectData.itemId);
      m_effectData = null;
    }
    
    updateBallsSpeed(iPlayState, 1.0);
    stopTimer();
  }
  
  //---------------------------------------------------------------------------
  // startTimer
  //---------------------------------------------------------------------------
  function startTimer(iPlayState, n_effectDurationInSecs) {
    if (!n_effectDurationInSecs) {
      return;
    }
    
    var n_ms = n_effectDurationInSecs * 1000;
    m_timerEvent = iPlayState.game.time.events.add(n_ms, onTimerEventComplete, this, iPlayState);
  }

  //---------------------------------------------------------------------------
  // stopTimer
  //---------------------------------------------------------------------------
  function stopTimer() {
    if (m_timerEvent) {
      Brickout.game.time.events.remove(m_timerEvent);
      m_timerEvent = null;
    }
  }
  
  //---------------------------------------------------------------------------
  // updateBallsSpeed
  //---------------------------------------------------------------------------
  function updateBallsSpeed(iPlayState, n_speedMultiplier) {
    var ballsGroup = iPlayState.getBallsGroup();
    ballsGroup.forEach(onBallUpdateSpeed, this, false, n_speedMultiplier);
  }
})(window);
