(function(global) {
  global.Brickout = global.Brickout || { };

  /////////////////////////////////////////////////////////////////////////////
  // constructor
  /////////////////////////////////////////////////////////////////////////////
  Brickout.PlayerEntity = function(game, playerRangeLine) {
    this.game = game;
    
    this.spriteGroup = game.add.sprite();
    this.spriteGroup.entity = this;
    this.spriteGroup.anchor.set(0.5, 0);
    
    game.physics.enable(this.spriteGroup);
    this.spriteGroup.body.bounce.set(1);
    this.spriteGroup.body.immovable = true;

    this.playerRangeLine = playerRangeLine;
    
    this.leftSprite = game.make.sprite(0, 0, 'atlas', 'player-left');
    this.spriteGroup.addChild(this.leftSprite);
    
    this.rightSprite = game.make.sprite(0, 0, 'atlas', 'player-right');
    this.spriteGroup.addChild(this.rightSprite);
    
    this.spriteBodyParts = [];
    
    this.bodySize = 0;
    this.restoreBodySize();
    
    this.attachedBallEntity = null;
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // static / const
  /////////////////////////////////////////////////////////////////////////////
  Brickout.PlayerEntity.STARTING_BODY_SIZE = 2;
  
  /////////////////////////////////////////////////////////////////////////////
  // public
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // attachBall
  //---------------------------------------------------------------------------
  Brickout.PlayerEntity.prototype.attachBall = function(ballEntity) {
    if (this.attachedBallEntity) {
      return; //can only attach one ball at a time
    }
    
    this.attachedBallEntity = ballEntity;
    var ballEntitySprte = this.attachedBallEntity.sprite;
    this.attachedBallEntity.y(this.y() - ballEntitySprte.body.height * ballEntitySprte.anchor.y);
  };
  
  //---------------------------------------------------------------------------
  // dispose
  //---------------------------------------------------------------------------
  Brickout.PlayerEntity.prototype.dispose = function() {
    this.spriteGroup.destroy();
    this.spriteBodyParts.length = 0;
    this.leftSprite = this.rightSprite = null;
    this.playerRangeLine = null;
    this.game = null;
  };
  
  //---------------------------------------------------------------------------
  // restoreBodySize
  //---------------------------------------------------------------------------
  Brickout.PlayerEntity.prototype.restoreBodySize = function() {
    this.setBodySize(Brickout.PlayerEntity.STARTING_BODY_SIZE);
  };
  
  //---------------------------------------------------------------------------
  // setBodySize
  //---------------------------------------------------------------------------
  Brickout.PlayerEntity.prototype.setBodySize = function(u_bodySize) {
    u_bodySize = Math.floor(u_bodySize);
    
    if (u_bodySize == 1) {
      this._setSingleBody();
    } else if (u_bodySize == 2) {
      this._setDoubleBody();
    } else if (u_bodySize > 2) {
      this._setMultiBody(u_bodySize);
    } else {
      return;
    }
    
    this.bodySize = u_bodySize;
    
    var minLeft = NaN;
    var maxRight = NaN;
    
    this.spriteGroup.children.forEach(function(child){
      if (isNaN(minLeft) || child.left < minLeft) {
        minLeft = child.left;
      }
                                      
      if (isNaN(maxRight) || child.right > maxRight) {
        maxRight = child.right;
      }
    });
  
    var parentWidth = maxRight - minLeft;
    this.spriteGroup.body.setSize(parentWidth, this.spriteGroup.height, this.spriteGroup.offsetX,
      this.spriteGroup.offsetY);
  };
  
  //---------------------------------------------------------------------------
  // update
  //---------------------------------------------------------------------------
  Brickout.PlayerEntity.prototype.update = function() {
    var n_xInput = this.game.input.x - this.spriteGroup.body.width / 2;
    var n_x = Phaser.Math.clamp(n_xInput, this.playerRangeLine.left,
      this.playerRangeLine.right - this.spriteGroup.body.width);
    this.x(n_x);
  };
  
  //---------------------------------------------------------------------------
  // x
  //---------------------------------------------------------------------------
  Brickout.PlayerEntity.prototype.x = function(value) {
    if (value === undefined) {
      return(this.spriteGroup.x);
    }
    this.spriteGroup.x = value;
    return(this);
  };
  
  //---------------------------------------------------------------------------
  // y
  //---------------------------------------------------------------------------
  Brickout.PlayerEntity.prototype.y = function(value) {
    if (value === undefined) {
      return(this.spriteGroup.y);
    }
    this.spriteGroup.y = value;
    return(this);
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // "private"
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // _addSpriteBodyPart
  //---------------------------------------------------------------------------
  Brickout.PlayerEntity.prototype._addSpriteBodyPart = function(x, s_key, u_midBodySize) {
    var sprite = this.game.make.sprite(x, 0, 'atlas', s_key);
    this.spriteGroup.addChild(sprite);
    
    if (u_midBodySize !== undefined) {
      sprite.scale.x = u_midBodySize;
    }
    
    this.spriteBodyParts.push(sprite);
    return(x + sprite.width);
  };
  
  //---------------------------------------------------------------------------
  // _setDoubleBody
  //---------------------------------------------------------------------------
  Brickout.PlayerEntity.prototype._setDoubleBody = function() {
    this._removeSpriteBodyParts();
    var x = this.leftSprite.x + this.leftSprite.width;
    x = this._addSpriteBodyPart(x, 'player-left-conn');
    x = this._addSpriteBodyPart(x, 'player-right-conn');
    this.rightSprite.x = x;
  };
  
  //---------------------------------------------------------------------------
  // _removeSpriteBodyParts
  //---------------------------------------------------------------------------
  Brickout.PlayerEntity.prototype._removeSpriteBodyParts = function() {
    for (var i_index = 0; i_index < this.spriteBodyParts.length; i_index++) {
      var sprite = this.spriteBodyParts[i_index];
      sprite.destroy();
    }
    this.spriteBodyParts.length = 0;
  };
  
  //---------------------------------------------------------------------------
  // _setMultiBody
  //---------------------------------------------------------------------------
  Brickout.PlayerEntity.prototype._setMultiBody = function(u_bodySize) {
    this._removeSpriteBodyParts();
    var x = this.leftSprite.x + this.leftSprite.width;
    x = this._addSpriteBodyPart(x, 'player-left-conn');
    var u_midBodySize = u_bodySize - 2;
    x = this._addSpriteBodyPart(x, 'player-body', u_midBodySize);
    x = this._addSpriteBodyPart(x, 'player-right-conn');
    this.rightSprite.x = x;
  };
  
  //---------------------------------------------------------------------------
  // _setSingleBody
  //---------------------------------------------------------------------------
  Brickout.PlayerEntity.prototype._setSingleBody = function() {
    this._removeSpriteBodyParts();
    var x = this.leftSprite.x + this.leftSprite.width;
    x = this._addSpriteBodyPart(x, 'player-smallbody');
    this.rightSprite.x = x;
  };
  
})(window);