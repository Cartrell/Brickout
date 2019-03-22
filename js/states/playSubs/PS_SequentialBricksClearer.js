(function(global) {
  global.Brickout = global.Brickout || { };

  /////////////////////////////////////////////////////////////////////////////
  // static / const
  /////////////////////////////////////////////////////////////////////////////
  var DEFAULT_CLEAR_RATE_MS = 5;
  
  /////////////////////////////////////////////////////////////////////////////
  // constructor
  /////////////////////////////////////////////////////////////////////////////
  Brickout.PS_SequentialBricksClearer = function(iPlayState, u_clearRateMs) {
    this.iPlayState = iPlayState;
    this.clearRateMs = typeof(u_clearRateMs) === 'number' ? u_clearRateMs : DEFAULT_CLEAR_RATE_MS;
    this.bricksToClear = [];
    this.timerEvent = null;
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // public
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // start
  //---------------------------------------------------------------------------
  Brickout.PS_SequentialBricksClearer.prototype.start = function(a_bricksToClear) {
    this._mergeIntoBricksToClear(a_bricksToClear);
    this._clearNextBrick();
  };
  
  //---------------------------------------------------------------------------
  // dispose
  //---------------------------------------------------------------------------
  Brickout.PS_SequentialBricksClearer.prototype.dispose = function() {
    this.iPlayState = null;
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // "private"
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // _clearNextBrick
  //---------------------------------------------------------------------------
  Brickout.PS_SequentialBricksClearer.prototype._clearNextBrick = function() {
    var brick = this.bricksToClear.shift();
    if (!brick) {
      this.timerEvent = null;
      return;
    }
    
    var CREATE_PARTICLES = true;
    Brickout.data.gameMap.clearBrick(brick, CREATE_PARTICLES);
    this.timerEvent = this.iPlayState.game.time.events.add(this.clearRateMs,
      this._onClearNextBrickTimerEventComplete, this);
  }

  //---------------------------------------------------------------------------
  // _mergeIntoBricksToClear
  //---------------------------------------------------------------------------
  Brickout.PS_SequentialBricksClearer.prototype._mergeIntoBricksToClear = function(a_newBricks) {
    for (var i_index = 0; i_index < a_newBricks.length; i_index++) {
      var newBrick = a_newBricks[i_index];
      if (this.bricksToClear.indexOf(newBrick) == -1) {
        this.bricksToClear.push(newBrick);
      }
    }
  }
  
  //---------------------------------------------------------------------------
  // _onClearNextBrickTimerEventComplete
  //---------------------------------------------------------------------------
  Brickout.PS_SequentialBricksClearer.prototype._onClearNextBrickTimerEventComplete = function() {
    this._clearNextBrick();
  }
    
})(window);