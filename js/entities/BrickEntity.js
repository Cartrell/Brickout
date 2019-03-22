(function(global) {
  global.Brickout = global.Brickout || {};

  /////////////////////////////////////////////////////////////////////////////
  // constructor
  /////////////////////////////////////////////////////////////////////////////
  Brickout.BrickEntity = function(game, n_x, n_y, s_frame, u_points, s_particleImageFrame) {
    this.game = game;
    this.points = u_points;
    this.frame = s_frame;
    this.sprite = this.game.make.sprite(n_x, n_y, 'atlas', s_frame);
    this.sprite.entity = this;
    this.sprite.isBrick = true;
    this.particleImageFrame = s_particleImageFrame;
    this.createBody();
    
    this.particleEmitter = null;
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // public
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // clear
  //---------------------------------------------------------------------------
  Brickout.BrickEntity.prototype.clear = function(b_createParticles) {
    if (b_createParticles === true) {
      this._createParticles();
    }
    
    this.destroyBody();
  };
  
  //---------------------------------------------------------------------------
  // createBody
  //---------------------------------------------------------------------------
  Brickout.BrickEntity.prototype.createBody = function() {
    if (!this.sprite.body) {
      this.game.physics.enable(this.sprite);
      this.sprite.body.bounce.set(1);
      this.sprite.body.immovable = true;
    }
  };
  
  //---------------------------------------------------------------------------
  // destroyBody
  //---------------------------------------------------------------------------
  Brickout.BrickEntity.prototype.destroyBody = function() {
    if (this.sprite.body !== null) {
      this.sprite.body.destroy();
    }
  };
  
  //---------------------------------------------------------------------------
  // dispose
  //---------------------------------------------------------------------------
  Brickout.BrickEntity.prototype.dispose = function() {
    this.particleEmitter = Brickout.Utils.DestroyResource(this.particleEmitter);
    this.sprite.entity = null;
    this.sprite.destroy();
    this.game = null;
  };
  
  //---------------------------------------------------------------------------
  // setUDed
  //---------------------------------------------------------------------------
  Brickout.BrickEntity.prototype.setUDed = function(b_isDed) {
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
  Brickout.BrickEntity.prototype.x = function(value) {
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
  Brickout.BrickEntity.prototype.y = function(value) {
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
  // _createParticles
  //---------------------------------------------------------------------------
  Brickout.BrickEntity.prototype._createParticles = function() {
    if (!this.particleImageFrame) {
      return;
    }
    
    var MAX_PARTICLES = 10;
    this.particleEmitter = this.game.add.emitter(this.sprite.centerX, this.sprite.centerY, MAX_PARTICLES);
    this.particleEmitter.minParticleScale = 0.5;
    this.particleEmitter.maxParticleScale = 1.25;
    this.particleEmitter.makeParticles('atlas', [ this.particleImageFrame ]);
    this.particleEmitter.minParticleSpeed.set(-100);
    this.particleEmitter.maxParticleSpeed.set(200);
    this.particleEmitter.gravity = 0;
    
    var IS_EXPLOSION = true;
    var LIFESPAN = 250;
    var FREQUENCY = null;
    var QUANTITY = MAX_PARTICLES;
    this.particleEmitter.start(IS_EXPLOSION, LIFESPAN, FREQUENCY, QUANTITY);
  };
})(window);