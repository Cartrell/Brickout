(function(global) {
  global.Brickout = global.Brickout || {};
  
  /////////////////////////////////////////////////////////////////////////////
  // constructor
  /////////////////////////////////////////////////////////////////////////////
  Brickout.PS_Ready = function(iPlayState) {
    this.iPlayState = iPlayState;
    this.player = null;
    this.servingBall = null;
    
    this.ballServeTween = null;
    this.ballServeTweenTarget = {
      x: undefined
    };
    
    this.onReady = new Phaser.Signal();
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // public
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // dispose
  //---------------------------------------------------------------------------
  Brickout.PS_Ready.prototype.dispose = function() {
    this.onReady = Brickout.Utils.DisposeResource(this.onReady);
    this.iPlayState = null;
  };
  
  //---------------------------------------------------------------------------
  // start
  //---------------------------------------------------------------------------
  Brickout.PS_Ready.prototype.start = function() {
    this.player = this.iPlayState.createPlayer();
    this._initServingBall();
    this.iPlayState.game.input.onTap.add(this._onInputTapped, this);
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // "private"
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // _initServingBall
  //---------------------------------------------------------------------------
  Brickout.PS_Ready.prototype._initServingBall = function() {
    var BALL_SPEED = 0; //keeps ball from moving on its own when created
    this.servingBall = this.iPlayState.createBall(BALL_SPEED);
    this.iPlayState.attachBallToPlayer(this.servingBall);
    this._startServeAngleSelection();
    this._updateAttachedBallPosition();
  };
  
  //---------------------------------------------------------------------------
  // _onInputTapped
  //---------------------------------------------------------------------------
  Brickout.PS_Ready.prototype._onInputTapped = function() {
    this.iPlayState.game.tweens.remove(this.ballServeTween);  
    this.onReady.dispatch(this.servingBall);
    this.servingBall = null;
  };
  
  //---------------------------------------------------------------------------
  // _onTweenUpdate
  //---------------------------------------------------------------------------
  Brickout.PS_Ready.prototype._onTweenUpdate = function() {
    this._updateAttachedBallPosition();
  };
  
  //---------------------------------------------------------------------------
  // _startServeAngleSelection
  //---------------------------------------------------------------------------
  Brickout.PS_Ready.prototype._startServeAngleSelection = function() {
    var PROPERTIES = {
      x: this.player.spriteGroup.body.width
    };
    
    var DURATION_MS = 1000;
    var EASE = null;
    var AUTO_START = true;
    var DELAY = null;
    var REPEAT = -1;
    var YOYO = true;
    var target = {
      x: 0
    };
    
    this.ballServeTween = this.iPlayState.game.tweens.create(target);
    this.ballServeTween.onUpdateCallback(this._onTweenUpdate, this);
    this.ballServeTween.to(PROPERTIES, DURATION_MS, EASE, AUTO_START, DELAY, REPEAT, YOYO);
  };
  
  //---------------------------------------------------------------------------
  // _updateAttachedBallPosition
  //---------------------------------------------------------------------------
  Brickout.PS_Ready.prototype._updateAttachedBallPosition = function() {
    this.servingBall.x(this.player.x() + this.ballServeTween.target.x);
  };  
})(window);