(function(global) {
  global.Brickout = global.Brickout || {};

  var ANIM_NAME_BLITZ = 'blitz';
  var BLITZ_ANIM_FPS = 8;
  var BLITZ_ANIM_LOOP = true;

  /////////////////////////////////////////////////////////////////////////////
  // constructor
  /////////////////////////////////////////////////////////////////////////////
  Brickout.BallEntity = function(game, n_speed, n_angle, b_doesPlayerOwn) {
    this.game = game;
    this.speed = 0;
    this.speedMultiplier = 1.0;
    this.doesPlayerOwn = b_doesPlayerOwn || false;
    
    //used with effects
    this.isBlitz = false;
    this.colorMatchingEffect = null;
    
    this.angle = n_angle;
    this.velocityNormal = new Phaser.Point();
    
    this.sprite = this.game.add.sprite(0, 0, 'atlas', 'orb-blue');
    this.sprite.entity = this;
    this.sprite.anchor.set(0.5);
    
    this.sprite.checkWorldBounds = true;
    this.sprite.events.onOutOfBounds.add(this._onOutOfBounds, this);
    
    this.blitzAnimation = this._createBlitzAnimation();
    this.blitzEmitter = null;
    
    this.onOutOfBounds = new Phaser.Signal();
    
    this.game.physics.enable(this.sprite);
    this.sprite.body.bounce.set(1);
    
    this.setAngle(n_angle);
    this.setSpeed(n_speed);
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // public
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // dispose
  //---------------------------------------------------------------------------
  Brickout.BallEntity.prototype.dispose = function() {
    this.sprite.entity = null;
    this.sprite.destroy();
    this.onOutOfBounds.dispose();
    this.blitzEmitter = Brickout.Utils.DestroyResource(this.blitzEmitter);
    this.game = null;
  };
  
  //---------------------------------------------------------------------------
  // getAngle
  //---------------------------------------------------------------------------
  Brickout.BallEntity.prototype.getAngle = function() {
    this.angle = this.sprite.body ? Phaser.Math.radToDeg(this.sprite.body.angle) || 0 : 0;
    return(this.angle);
  };
  
  //---------------------------------------------------------------------------
  // setAngle
  //---------------------------------------------------------------------------
  Brickout.BallEntity.prototype.setAngle = function(n_angleInDegrees) {
    if (typeof(n_angleInDegrees) === 'number') {
      this._updateVelocity(n_angleInDegrees);
    }
  };
  
  //---------------------------------------------------------------------------
  // setBlitz
  //---------------------------------------------------------------------------
  Brickout.BallEntity.prototype.setBlitz = function(b_isBlitz) {
    var ballSprite = this.sprite;
    this.isBlitz = b_isBlitz;
    if (b_isBlitz) {
      ballSprite.scale.set(2.0);
      this.blitzAnimation.play(BLITZ_ANIM_FPS, BLITZ_ANIM_LOOP);
      this._startBlitzEmitter();
    } else {
      ballSprite.scale.set(1.0);
      this._stopBlitzAnimation();
      this._stopBlitzEmitter();
    }
  };
  
  //---------------------------------------------------------------------------
  // setSpeed
  //---------------------------------------------------------------------------
  Brickout.BallEntity.prototype.setSpeed = function(n_value) {
    if (typeof(n_value) === 'number') {
      this.speed = n_value;
      this._updateVelocity();
    }
  }
    
  //---------------------------------------------------------------------------
  // setSpeedMultiplier
  //---------------------------------------------------------------------------
  Brickout.BallEntity.prototype.setSpeedMultiplier = function(n_value) {
    if (typeof(n_value) === 'number') {
      this.speedMultiplier = n_value;
      this._updateVelocity();
    }
  }
  
  //---------------------------------------------------------------------------
  // update
  //---------------------------------------------------------------------------
  Brickout.BallEntity.prototype.update = function() {
    this._updateBlitzEmitter();
  };
  
  //---------------------------------------------------------------------------
  // x
  //---------------------------------------------------------------------------
  Brickout.BallEntity.prototype.x = function(value) {
    if (value === undefined) {
      return(this.sprite.x);
    }
    this.sprite.x = value;
    return(this);
  };
  
  //---------------------------------------------------------------------------
  // y
  //---------------------------------------------------------------------------
  Brickout.BallEntity.prototype.y = function(value) {
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
  // _createBlitzAnimation
  //---------------------------------------------------------------------------
  Brickout.BallEntity.prototype._createBlitzAnimation = function() {
    return(this.sprite.animations.add(ANIM_NAME_BLITZ, [ 'orb-blue', 'orb-cyan', 'orb-green', 'orb-magenta',
      'orb-orange', 'orb-purple', 'orb-red', 'orb-yellow' ],
      BLITZ_ANIM_FPS, BLITZ_ANIM_LOOP));
  };
  
  //---------------------------------------------------------------------------
  // _createBlitzEmitter
  //---------------------------------------------------------------------------
  Brickout.BallEntity.prototype._createBlitzEmitter = function() {
    var MAX_PARTICLES = 10;
    this.blitzEmitter = this.game.add.emitter(this.x(), this.y(), MAX_PARTICLES);
    this.blitzEmitter.maxParticleScale = 2.0;
    this.blitzEmitter.makeParticles('atlas', [ 'particle-cross-blue', 'particle-cross-cyan',
      'particle-cross-green', 'particle-cross-magenta', 'particle-cross-orange', 'particle-cross-purple',
      'particle-cross-red', 'particle-cross-yellow']);
    var IS_EXPLOSION = false;
    var LIFESPAN = 500;
    var FREQUENCY = 30;
    this.blitzEmitter.start(IS_EXPLOSION, LIFESPAN, FREQUENCY);
  };
      
  //---------------------------------------------------------------------------
  // _onOutOfBounds
  //---------------------------------------------------------------------------
  Brickout.BallEntity.prototype._onOutOfBounds = function(sprite) {
    this.onOutOfBounds.dispatch(this);
  };
  
  //---------------------------------------------------------------------------
  // _startBlitzEmitter
  //---------------------------------------------------------------------------
  Brickout.BallEntity.prototype._startBlitzEmitter = function() {
    if (this.blitzEmitter) {
      this.blitzEmitter.on = true;
    } else {
      this._createBlitzEmitter();
    }
  };
  
  //---------------------------------------------------------------------------
  // _stopBlitzAnimation
  //---------------------------------------------------------------------------
  Brickout.BallEntity.prototype._stopBlitzAnimation = function() {
    var RESET_FRAME = true;
    this.blitzAnimation.stop(RESET_FRAME);
  };
  
  //---------------------------------------------------------------------------
  // _stopBlitzEmitter
  //---------------------------------------------------------------------------
  Brickout.BallEntity.prototype._stopBlitzEmitter = function() {
    if (this.blitzEmitter) {
      this.blitzEmitter.on = false;
    }
  };
  
  //---------------------------------------------------------------------------
  // _updateBlitzEmitter
  //---------------------------------------------------------------------------
  Brickout.BallEntity.prototype._updateBlitzEmitter = function() {
    if (this.blitzEmitter) {
      this.blitzEmitter.x = this.x();
      this.blitzEmitter.y = this.y();
    }
  };
  
  //---------------------------------------------------------------------------
  // _updateVelocity
  //---------------------------------------------------------------------------
  Brickout.BallEntity.prototype._updateVelocity = function(n_angleInDegrees) {
    var n_angleInRadians;
    var n_x;
    var n_y;
    var n_finalSpeed = this.speed * this.speedMultiplier;
    
    if (n_angleInDegrees !== undefined) {
      n_angleInRadians = Phaser.Math.degToRad(n_angleInDegrees);
      n_x = Math.cos(n_angleInRadians) * n_finalSpeed;
      n_y = -Math.sin(n_angleInRadians) * n_finalSpeed;
    } else if (this.sprite.body.velocity.isZero()) {
      n_angleInRadians = Phaser.Math.degToRad(this.angle);
      n_x = Math.cos(n_angleInRadians) * n_finalSpeed;
      n_y = -Math.sin(n_angleInRadians) * n_finalSpeed;
    } else {
      this.velocityNormal.copyFrom(this.sprite.body.velocity);
      this.velocityNormal.normalize();
      n_x = this.velocityNormal.x * n_finalSpeed;
      n_y = this.velocityNormal.y * n_finalSpeed;
    }
    
    this.sprite.body.velocity.set(n_x, n_y);
  };
})(window);