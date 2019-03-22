(function(global) {
  global.Brickout = global.Brickout || {};

  /////////////////////////////////////////////////////////////////////////////
  // constructor
  /////////////////////////////////////////////////////////////////////////////
  Brickout.SaverBrickEntity = function(game, n_x, n_y, u_id, u_minTimeSec, u_maxTimeSec) {
    this.game = game;
    
    this.sprite = this.game.make.sprite(n_x, n_y, 'atlas', 'bridge-brick');
    this.sprite.entity = this;
    this.sprite.isBrick = true;
    this.sprite.saverBrickId = u_id;
    
    this.particleEmitter = null;
    this.durationTimerEvent = null;
    this.isWarning = false;
    
    this.createBody();
    
    this.timerSeconds = 0; //number of times timer will fire
    this.timerCount = 0; //number of times timer has fired
    this.timeWarnTicks = 0;
    
    this._setDurationTimer(u_minTimeSec, u_maxTimeSec);
    this.sprite.update = onUpdate;
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // static / const
  /////////////////////////////////////////////////////////////////////////////
  Brickout.SaverBrickEntity._WARN_SECONDS_START = 2;
  Brickout.SaverBrickEntity._WARN_FLICKER_TICKS = 2;
  
  /////////////////////////////////////////////////////////////////////////////
  // public
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // clear
  //---------------------------------------------------------------------------
  Brickout.SaverBrickEntity.prototype.clear = function() {
    this._createParticles();
    this.dispose();
  };
  
  //---------------------------------------------------------------------------
  // createBody
  //---------------------------------------------------------------------------
  Brickout.SaverBrickEntity.prototype.createBody = function() {
    if (!this.sprite.body) {
      this.game.physics.enable(this.sprite);
      this.sprite.body.bounce.set(1);
      this.sprite.body.immovable = true;
    }
  };
  
  //---------------------------------------------------------------------------
  // dispose
  //---------------------------------------------------------------------------
  Brickout.SaverBrickEntity.prototype.dispose = function() {
    if (this.game) {
      if (this.durationTimerEvent) {
        this.game.time.events.remove(this.durationTimerEvent);
        this.durationTimerEvent = null;
      }
    }
    
    if (this.sprite.body !== null) {
      this.sprite.body.destroy();
    }
    
    this.sprite.destroy();
    this.sprite.entity = null;
    this.game = null;
  };
  
  //---------------------------------------------------------------------------
  // setUDed
  //---------------------------------------------------------------------------
  Brickout.SaverBrickEntity.prototype.setUDed = function(b_isDed) {
    if (b_isDed === true) {
      this.sprite.loadTexture('atlas', 'block-u-ded');
    } else {
      this.sprite.loadTexture('atlas', this.frame);
    }
  }
  
  //---------------------------------------------------------------------------
  // x
  //---------------------------------------------------------------------------
  /**
  * Gets or sets the x position of this brick's sprite.
  * @param {number} value - The new x position.
  * @return {number or self} - If value is not undefined, the current x position is returned (number).
  * Otherwise, the object itself is returned (can be used for chaining).
  */
  Brickout.SaverBrickEntity.prototype.x = function(value) {
    if (value === undefined) {
      return(this.sprite.x);
    }
    this.sprite.x = value;
    return(this);
  };
  
  //---------------------------------------------------------------------------
  // y
  //---------------------------------------------------------------------------
  /**
  * Gets or sets the y position of this brick's sprite.
  * @param {number} value - The new y position.
  * @return {number or self} - If value is not undefined, the current y position is returned (number).
  * Otherwise, the object itself is returned (can be used for chaining).
  */
  Brickout.SaverBrickEntity.prototype.y = function(value) {
    if (value === undefined) {
      return(this.sprite.y);
    }
    this.sprite.y = value;
    return(this);
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // "private"
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // _checkWarn
  //---------------------------------------------------------------------------
  Brickout.SaverBrickEntity.prototype._checkWarn = function() {
    var u_secondsRemaining = this.timerSeconds - this.timerCount;
    if (u_secondsRemaining <= Brickout.SaverBrickEntity._WARN_SECONDS_START) {
      this.isWarning = true;
    }
  };
    
  //---------------------------------------------------------------------------
  // _createParticles
  //---------------------------------------------------------------------------
  Brickout.SaverBrickEntity.prototype._createParticles = function() {
    var MAX_PARTICLES = 12;
    var PARTICLE_IMAGE_FRAME = "brick-particle-gray";
    this.particleEmitter = this.game.add.emitter(this.sprite.centerX, this.sprite.centerY,
      MAX_PARTICLES);
    this.particleEmitter.minParticleScale = 0.75;
    this.particleEmitter.maxParticleScale = 1.5;
    this.particleEmitter.makeParticles('atlas', [ PARTICLE_IMAGE_FRAME ]);
    this.particleEmitter.minParticleSpeed.set(-100);
    this.particleEmitter.maxParticleSpeed.set(200);
    this.particleEmitter.gravity = 0;
    
    var IS_EXPLOSION = true;
    var LIFESPAN = 250;
    var FREQUENCY = null;
    var QUANTITY = MAX_PARTICLES;
    this.particleEmitter.start(IS_EXPLOSION, LIFESPAN, FREQUENCY, QUANTITY);
  };
  
  //---------------------------------------------------------------------------
  // _onDurationTimerEventComplete
  //---------------------------------------------------------------------------
  Brickout.SaverBrickEntity.prototype._onDurationTimerEventComplete = function() {
    this.timerCount++;
    if (this.timerCount >= this.timerSeconds) {
      this.dispose();
    }
  };
  
  //---------------------------------------------------------------------------
  // _setDurationTimer
  //---------------------------------------------------------------------------
  Brickout.SaverBrickEntity.prototype._setDurationTimer = function(u_minTimeSec, u_maxTimeSec) {
    this.timerSeconds = u_minTimeSec + Math.floor(Math.random() * (u_maxTimeSec - u_minTimeSec + 1));
    this.durationTimerEvent = this.game.time.events.repeat(Phaser.Timer.SECOND, this.timerSeconds,
      this._onDurationTimerEventComplete, this);
  };
  
  //---------------------------------------------------------------------------
  // _updateWarning
  //---------------------------------------------------------------------------
  Brickout.SaverBrickEntity.prototype._updateWarning = function() {
    if (this.timeWarnTicks++ >= Brickout.SaverBrickEntity._WARN_FLICKER_TICKS) {
      this.sprite.visible = !this.sprite.visible;
    }
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // "local"
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // onUpdate
  //---------------------------------------------------------------------------
  function onUpdate() {
    //'this' is the entity sprite
    var entity = this.entity;
    if (entity.isWarning) {
      entity._updateWarning();
    } else {
      entity._checkWarn();
    }
  }
  
})(window);