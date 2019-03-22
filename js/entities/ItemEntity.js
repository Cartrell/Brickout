(function(global) {
  global.Brickout = global.Brickout || {};

  /////////////////////////////////////////////////////////////////////////////
  // constructor
  /////////////////////////////////////////////////////////////////////////////
  Brickout.ItemEntity = function(game, n_speed, itemData) {
    this.game = game;
    this.itemData = itemData;
    this.speed = 0;
    
    this.sprite = this.game.make.sprite(0, 0, 'atlas');
    this.sprite.entity = this;
    
    var FPS = 6;
    var LOOP = true;
    this.sprite.animations.add('glow', itemData.imageFrames, FPS, LOOP);
    this.sprite.animations.play('glow');
    
    this.sprite.checkWorldBounds = true;
    this.sprite.events.onOutOfBounds.add(this._onOutOfBounds, this);
    
    this.onOutOfBounds = new Phaser.Signal();
    
    this.game.physics.enable(this.sprite);
    
    this.setAngle(270);
    this.setSpeed(n_speed);
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // public
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // dispose
  //---------------------------------------------------------------------------
  Brickout.ItemEntity.prototype.dispose = function() {
    this.sprite.entity = null;
    this.sprite.destroy();
    this.onOutOfBounds.dispose();
    this.game = null;
  };
  
  //---------------------------------------------------------------------------
  // setAngle
  //---------------------------------------------------------------------------
  Brickout.ItemEntity.prototype.setAngle = function(n_value) {
    if (typeof(n_value) !== 'number') {
      return;
    }
    
    this.angle = n_value;
    
    var radians = Phaser.Math.degToRad(this.angle);
    var x = Math.cos(radians) * this.speed;
    var y = -Math.sin(radians) * this.speed;
    this.sprite.body.velocity.set(x, y);
  };
  
  //---------------------------------------------------------------------------
  // setSpeed
  //---------------------------------------------------------------------------
  Brickout.ItemEntity.prototype.setSpeed = function(n_value) {
    if (typeof(n_value) !== 'number') {
      return;
    }
    
    this.speed = n_value;
    
    var radians = Phaser.Math.degToRad(this.angle);
    var x = Math.cos(radians) * this.speed;
    var y = -Math.sin(radians) * this.speed;
    this.sprite.body.velocity.set(x, y);
  }
    
  //---------------------------------------------------------------------------
  // update
  //---------------------------------------------------------------------------
  Brickout.ItemEntity.prototype.update = function() {
  };
  
  //---------------------------------------------------------------------------
  // x
  //---------------------------------------------------------------------------
  Brickout.ItemEntity.prototype.x = function(value) {
    if (value === undefined) {
      return(this.sprite.x);
    }
    this.sprite.x = value;
    return(this);
  };
  
  //---------------------------------------------------------------------------
  // y
  //---------------------------------------------------------------------------
  Brickout.ItemEntity.prototype.y = function(value) {
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
  // _onOutOfBounds
  //---------------------------------------------------------------------------
  Brickout.ItemEntity.prototype._onOutOfBounds = function(sprite) {
    this.onOutOfBounds.dispatch(this);
  };
  
})(window);