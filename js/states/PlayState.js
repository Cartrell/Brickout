(function(global) {
  global.Brickout = global.Brickout || {};
  Brickout.PlayState = Brickout.PlayState || {};
  
  var m_levelBuilder = null;
  var m_background = null;
  var m_ready = null;
  var m_ui = null;
  var m_bricksDescend = null;
  
  var m_tilemapGroup = null;
  var m_backgroundGroup = null;
  var m_ballsGroup = null;
  var m_itemsGroup = null;
  var m_uiGroup = null;
  
  var m_player = null;
  
  //key: string (item id)
  //data: PS_xxxEffect
  var m_effectRunnersByItemId = null;
  
  var m_isPlayActive = false;
  
  var m_numBricksClearedDuringPass = 0;
  var m_numServesRemainingForNextItem;
  var m_numBricksToClearToNextBackgroundChange = 0;
  
  /////////////////////////////////////////////////////////////////////////////
  // static / const
  /////////////////////////////////////////////////////////////////////////////
  Brickout.PlayState.NUM_BRICKS_TO_CLEAR_TO_NEXT_BG_CHANGE = 51;
  
  /////////////////////////////////////////////////////////////////////////////
  // public
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // addLife
  //---------------------------------------------------------------------------
  Brickout.PlayState.addLife = function() {
    this._setLives(Brickout.data.player.lives + 1);
  };
  
  //---------------------------------------------------------------------------
  // addPoints
  //---------------------------------------------------------------------------
  Brickout.PlayState.addPoints = function(u_points) {
    var playerData = Brickout.data.player;
    playerData.score += u_points;
    m_ui.setScore(playerData.score);
  };
  
  //---------------------------------------------------------------------------
  // attachBallToPlayer
  //---------------------------------------------------------------------------
  Brickout.PlayState.attachBallToPlayer = function(ballEntity) {
    if (m_player && ballEntity) {
      m_player.attachBall(ballEntity);
    }
  };
  
  //---------------------------------------------------------------------------
  // beginTremor
  //---------------------------------------------------------------------------
  Brickout.PlayState.beginTremor = function() {
    //The intensity of the camera shake is a percentage of the camera width (in pixels). However, in the
    // case of this game, pixels are easier for me to conceptualize, so the percentage can be calculated by:
    // [desired intensity, in pixels] / [camera width]
    var INTENSITY_PX = 4;
    var INTENSITY = INTENSITY_PX / this.camera.width;
    var DURATION_MS = 350;
    this.camera.shake(INTENSITY, DURATION_MS);
  };
  
  //---------------------------------------------------------------------------
  // create
  //---------------------------------------------------------------------------
  Brickout.PlayState.create = function() {
    this._setLevel(Brickout.data.START_LEVEL);
    this._setLives(Brickout.data.START_LIVES);
    this._setScore(0);
    m_background.setRandomBackground();
    m_background.start();
    this._ready();
    this._resetNumServesRemainingForNextItem();
    m_numBricksToClearToNextBackgroundChange = Brickout.PlayState.NUM_BRICKS_TO_CLEAR_TO_NEXT_BG_CHANGE;
  };
  
  //---------------------------------------------------------------------------
  // createBall
  //---------------------------------------------------------------------------
  Brickout.PlayState.createBall = function(n_ballSpeed) {
    var levelData = Brickout.Levels.GetData(this.game, Brickout.data.player.level);
    var n_speed = typeof(n_ballSpeed) === 'number' ? n_ballSpeed : levelData.ballSpeed;
    var n_angle = Math.random() >= 0.5 ? 45 : 135;
    var DOES_PLAYER_OWN = true;
    var ball = new Brickout.BallEntity(this.game, n_speed, n_angle, DOES_PLAYER_OWN);
    
    var gameMap = Brickout.data.gameMap;
    var n_x = Phaser.Math.between(gameMap.ballStartLine.left, gameMap.ballStartLine.right);
    ball.x(n_x).y(gameMap.ballStartLine.y);
    return(this._addBall(ball));
  };
  
  //---------------------------------------------------------------------------
  // createPlayer
  //---------------------------------------------------------------------------
  Brickout.PlayState.createPlayer = function() {
    if (m_player) {
      return(m_player);
    }
    
    var gameMap = Brickout.data.gameMap;
    m_player = new Brickout.PlayerEntity(this.game, gameMap.playerRangeLine);
    m_player.x(gameMap.playerStartPoint.x)
      .y(gameMap.playerStartPoint.y);
    return(m_player);
  };
  
  //---------------------------------------------------------------------------
  // getBallsGroup
  //---------------------------------------------------------------------------
  Brickout.PlayState.getBallsGroup = function() {
    return(m_ballsGroup);
  };
  
  //---------------------------------------------------------------------------
  // getPlayer
  //---------------------------------------------------------------------------
  Brickout.PlayState.getPlayer = function() {
    return(m_player);
  };
  
  //---------------------------------------------------------------------------
  // getUi
  //---------------------------------------------------------------------------
  Brickout.PlayState.getUi = function() {
    return(m_ui);
  };
  
  //---------------------------------------------------------------------------
  // init
  //---------------------------------------------------------------------------
  Brickout.PlayState.init = function() {
    Brickout.Utils.ResetData();
    
    m_backgroundGroup = this.game.add.group();
    m_tilemapGroup = this.game.add.group();
    m_itemsGroup = this.game.add.group();
    m_ballsGroup = this.game.add.group();
    m_uiGroup = this.game.add.group();
    
    m_ui = new Brickout.PS_Ui(m_uiGroup);
    m_levelBuilder = new Brickout.PS_LevelBuilder(this, m_tilemapGroup);
    m_background = new Brickout.PS_Background(this.game, m_backgroundGroup);
    m_ready = new Brickout.PS_Ready(this);
    m_bricksDescend = new Brickout.PS_BricksDescend(this.game);
    
    m_effectRunnersByItemId = { };
    m_effectRunnersByItemId[Brickout.Items.Keys.SPEED_UP] = Brickout.PS_SpeedEffect;
    m_effectRunnersByItemId[Brickout.Items.Keys.SPEED_DOWN] = Brickout.PS_SpeedEffect;
    m_effectRunnersByItemId[Brickout.Items.Keys.BOMB] = Brickout.PS_BombEffect;
    m_effectRunnersByItemId[Brickout.Items.Keys.COLOR_BLAST] = Brickout.PS_ColorBlastEffect;
    m_effectRunnersByItemId[Brickout.Items.Keys.SAVER] = Brickout.PS_SaverEffect;
    m_effectRunnersByItemId[Brickout.Items.Keys.EXTRA_BALL] = Brickout.PS_ExtraBallEffect;
    m_effectRunnersByItemId[Brickout.Items.Keys.NEW_BALL] = Brickout.PS_NewBallEffect;
    m_effectRunnersByItemId[Brickout.Items.Keys.BONUS_POINTS] = Brickout.PS_BonusPointsEffect;
    m_effectRunnersByItemId[Brickout.Items.Keys.BLITZ_BALL] = Brickout.PS_BlitzBallEffect;
    m_effectRunnersByItemId[Brickout.Items.Keys.COLOR_MATCH] = Brickout.PS_ColorMatchEffect;
    m_effectRunnersByItemId[Brickout.Items.Keys.PADDLE_BUFF] = Brickout.PS_PaddleBuffEffect;
    m_effectRunnersByItemId[Brickout.Items.Keys.PADDLE_NERF] = Brickout.PS_PaddleBuffEffect;
  };
  
  //---------------------------------------------------------------------------
  // preRender
  //---------------------------------------------------------------------------
  Brickout.PlayState.preRender = function() {
  };
  
  //---------------------------------------------------------------------------
  // render
  //---------------------------------------------------------------------------
  Brickout.PlayState.render = function() {
    /*for (var i=0; i < Brickout.data.gameMap.bricksGroup.length; i++) {
      this.game.debug.body(Brickout.data.gameMap.bricksGroup.getChildAt(i));
    }*/
    
    /*for (var i=0; i < m_ballsGroup.length; i++) {
      this.game.debug.body(m_ballsGroup.getChildAt(i));
    }
    
    if (m_player) {
      this.game.debug.body(m_player.spriteGroup);
    }*/
    
    if (this.game.debugRect) {
      this.game.debug.geom(this.game.debugRect);
    }
  };
  
  //---------------------------------------------------------------------------
  // shutdown
  //---------------------------------------------------------------------------
  Brickout.PlayState.shutdown = function() {
    m_levelBuilder.dispose();
    m_background.dispose();
    m_ready.dispose();
  };
  
  //---------------------------------------------------------------------------
  // update
  //---------------------------------------------------------------------------
  Brickout.PlayState.update = function() {
    if (m_player) {
      m_player.update();
    }
    
    if (m_isPlayActive) {
      this._updateActivePlay();
    }
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // "private"
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // _addBall
  //---------------------------------------------------------------------------
  Brickout.PlayState._addBall = function(ball) {
    ball.onOutOfBounds.add(this._onBallOutOfBounds, this);
    m_ballsGroup.addChild(ball.sprite);
    
    /*
      call addToHash here for collision detection to work properly - I prefer to setup the physics body on the
      ball sprite FIRST, THEN add it to the group. However, when doing it this way, arcade physics will not
      automatically add the sprite to the group's hash.
    */
    m_ballsGroup.addToHash(ball.sprite);
    return(ball);
  };
  
  //---------------------------------------------------------------------------
  // _areAnyBricksLeft
  //---------------------------------------------------------------------------
  Brickout.PlayState._areAnyBricksLeft = function() {
    return(Brickout.data.gameMap.bricksGroup.length > 0);
  };
  
  //---------------------------------------------------------------------------
  // _areAnyLivesLeft
  //---------------------------------------------------------------------------
  Brickout.PlayState._areAnyLivesLeft = function() {
    return(Brickout.data.player.lives > 0);
  };
  
  //---------------------------------------------------------------------------
  // _areAnyPlayerOwnedBallsLeft
  //---------------------------------------------------------------------------
  Brickout.PlayState._areAnyPlayerOwnedBallsLeft = function() {
    var a_balls = m_ballsGroup.children;
    for (var i_index = 0; i_index < a_balls.length; i_index++) {
      var ball = a_balls[i_index];
      if (ball.entity.doesPlayerOwn) {
        return(true);
      }
    }
    return(false);
  };
  
  //---------------------------------------------------------------------------
  // _beginDescendProgression
  //---------------------------------------------------------------------------
  Brickout.PlayState._beginDescendProgression = function() {
    m_bricksDescend.begin(m_numBricksClearedDuringPass);
  };
  
  //---------------------------------------------------------------------------
  // _beginItemsProgression
  //---------------------------------------------------------------------------
  Brickout.PlayState._beginItemsProgression = function(brickEntity) {
    Brickout.data.player.addItemPoint(brickEntity.frame);
    
    if (m_numServesRemainingForNextItem > 0) {
      if (--m_numServesRemainingForNextItem == 0) {
        this._createItem();
        this._resetNumServesRemainingForNextItem();
      }
    }
  };
  
  //---------------------------------------------------------------------------
  // _beginLevelProgression
  //---------------------------------------------------------------------------
  Brickout.PlayState._beginLevelProgression = function() {
    if (!this._areAnyBricksLeft()) {
      this._setNextLevel();
    }
  };
  
  //---------------------------------------------------------------------------
  // _beginOutro
  //---------------------------------------------------------------------------
  Brickout.PlayState._beginOutro = function() {
    m_isPlayActive = false;
    var CLEAR_WORLD = false;
    this.game.state.start("OutroState", CLEAR_WORLD);
  };

  //---------------------------------------------------------------------------
  // _beginProgressions
  //---------------------------------------------------------------------------
  Brickout.PlayState._beginProgressions = function() {
    this._beginLevelProgression();
    this._beginDescendProgression();
  };
  
  //---------------------------------------------------------------------------
  // _beginTremorForBlitzBall
  //---------------------------------------------------------------------------
  Brickout.PlayState._beginTremorForBlitzBall = function(ballEntity) {
    if (ballEntity.isBlitz) {
      Brickout.Utils.Tremor(this.game.camera);
    }
  };
    
  //---------------------------------------------------------------------------
  // _calcBrickPoints
  //---------------------------------------------------------------------------
  Brickout.PlayState._calcBrickPoints = function(brickEntity) {
    var u_level = Brickout.data.player.level;
    var u_points = brickEntity.points;
    return(u_points + Math.floor(u_points * u_level * Brickout.PointsData.GROWTH_RATE));
  };
  
  //---------------------------------------------------------------------------
  // _createItem
  //---------------------------------------------------------------------------
  Brickout.PlayState._createItem = function() {
    var s_brickFrame = Brickout.data.player.getRandomBrickEntityFrame();
    var itemData = s_brickFrame ? Brickout.data.player.getItemData(s_brickFrame) : null;
    if (!itemData) {
      return;
    }
    
    Brickout.data.player.removeItemPointsByBrickFrame(s_brickFrame);
    
    var itemEntity = new Brickout.ItemEntity(this.game, 300, itemData);
    itemEntity.onOutOfBounds.addOnce(this._onItemOutOfBounds, this, undefined, itemEntity);
    
    var itemSprite = itemEntity.sprite;
    m_itemsGroup.add(itemSprite);
    
    var itemsStartLine = Brickout.data.gameMap.itemsStartLine;
    var n_x = Phaser.Math.between(itemsStartLine.left, itemsStartLine.right - itemSprite.width);
    itemEntity.x(n_x).y(itemsStartLine.top);
  };
  
  //---------------------------------------------------------------------------
  // _clearBrick
  //---------------------------------------------------------------------------
  Brickout.PlayState._clearBrick = function(brickEntity, b_wasClearedByBlitzBall) {
    var u_points = this._calcBrickPoints(brickEntity);
    this.addPoints(u_points);
    
    if (!b_wasClearedByBlitzBall) {
      //blitz balls may not generate items, or influence bricks descension
      m_numBricksClearedDuringPass++;
      this._beginItemsProgression(brickEntity);
    }
    
    var CREATE_PARTICLES = true;
    Brickout.data.gameMap.clearBrick(brickEntity, CREATE_PARTICLES);
  };
  
  //---------------------------------------------------------------------------
  // _handleColorMatchPrep
  //---------------------------------------------------------------------------
  Brickout.PlayState._handleColorMatchPrep = function(ballEntity) {
    var playerData = Brickout.data.player;
    var o_colorMatchEffect = playerData.getEffect(Brickout.Items.Keys.COLOR_MATCH);
    if (o_colorMatchEffect) {
      o_colorMatchEffect.onPlayerBallCollide(ballEntity);
    }
  };
    
  //---------------------------------------------------------------------------
  // _handleColorMatchRun
  //---------------------------------------------------------------------------
  Brickout.PlayState._handleColorMatchRun = function(ballEntity, brickEntity) {
    var playerData = Brickout.data.player;
    var o_effectData = playerData.getEffect(Brickout.Items.Keys.COLOR_MATCH);
    if (o_effectData) {
      o_effectData.onBallClearedBrick(ballEntity, brickEntity);
    }
  };
  
  //---------------------------------------------------------------------------
  // _handlePaddleBuffEffect
  //---------------------------------------------------------------------------
  Brickout.PlayState._handlePaddleBuffEffect = function() {
    var playerData = Brickout.data.player;
    var effectData =
      playerData.getEffect(Brickout.Items.Keys.PADDLE_BUFF) ||
      playerData.getEffect(Brickout.Items.Keys.PADDLE_NERF);
    if (!effectData) {
      return;
    }
    
    var u_numHitsRemaining = Brickout.PS_PaddleBuffEffect.GetNumHitsRemaining(effectData);
    u_numHitsRemaining--;
    if (u_numHitsRemaining <= 0) {
      playerData.removeEffectData(effectData);
      m_player.restoreBodySize();
    } else {
      Brickout.PS_PaddleBuffEffect.SetNumHitsRemaining(effectData, u_numHitsRemaining);
    }
  };
  
  //---------------------------------------------------------------------------
  // _onBallBrickCollide
  //---------------------------------------------------------------------------
  Brickout.PlayState._onBallBrickCollide = function(ballSprite, brickSprite) {
    var WAS_CLEARED_BY_BLITZ_BALL = false;
    Brickout.sndSys.play(Brickout.Sounds.Ids.BRICK_BREAK);
    this._clearBrick(brickSprite.entity, WAS_CLEARED_BY_BLITZ_BALL);
    this._handleColorMatchRun(ballSprite.entity, brickSprite.entity);
    this._handleBackgroundChangeProgression();
  };
  
  //---------------------------------------------------------------------------
  // _handleBackgroundChangeProgression
  //---------------------------------------------------------------------------
  Brickout.PlayState._handleBackgroundChangeProgression = function() {
    if (--m_numBricksToClearToNextBackgroundChange > 0) {
      return;
    }
    
    m_numBricksToClearToNextBackgroundChange = Brickout.PlayState.NUM_BRICKS_TO_CLEAR_TO_NEXT_BG_CHANGE;
    m_background.setRandomBackground();
  };
  
  //---------------------------------------------------------------------------
  // _onBallBrickProcess
  //---------------------------------------------------------------------------
  Brickout.PlayState._onBallBrickProcess = function(ballSprite, brickSprite) {
    var ballEntity = ballSprite.entity;
    if (!ballEntity.isBlitz) {
      return(true); //separation and collision happens normally
    }
    
    //blitz balls go thru bricks, but still break them
    var WAS_CLEARED_BY_BLITZ_BALL = true;
    this._clearBrick(brickSprite.entity, WAS_CLEARED_BY_BLITZ_BALL);
    return(false);
  };
  
  //---------------------------------------------------------------------------
  // _onBallOutOfBounds
  //---------------------------------------------------------------------------
  Brickout.PlayState._onBallOutOfBounds = function(ballEntity) {
    this._removeBall(ballEntity);
    
    if (this._areAnyPlayerOwnedBallsLeft()) {
      Brickout.sndSys.play(Brickout.Sounds.Ids.LOST_A_BALL);
      return;
    }
    
    //player lost a life
    this._removePlayer();
    this._removeLife();
    Brickout.data.player.brickDescendLevel = 0;
    Brickout.sndSys.play(Brickout.Sounds.Ids.LOST_A_LIFE, this._onLostALifeSoundStop, this);
  };
  
  //---------------------------------------------------------------------------
  // _onBallSaverBrickCollide
  //---------------------------------------------------------------------------
  Brickout.PlayState._onBallSaverBrickCollide = function(ballSprite, brickSprite) {
    var brickEntity = brickSprite.entity;
    Brickout.data.gameMap.clearSaverBrick(brickEntity);
    Brickout.sndSys.play(Brickout.Sounds.Ids.SAVER_BRICK_BREAK);
  };
  
  //---------------------------------------------------------------------------
  // _onBallWallsCollide
  //---------------------------------------------------------------------------
  Brickout.PlayState._onBallWallsCollide = function(ballSprite, wallsLayer) {
    var ballEntity = ballSprite.entity;
    this._playBallCollideMetalSound(ballEntity);
    this._beginTremorForBlitzBall(ballEntity);
  };
  
  //---------------------------------------------------------------------------
  // _onItemOutOfBounds
  //---------------------------------------------------------------------------
  Brickout.PlayState._onItemOutOfBounds = function(itemEntity) {
    itemEntity.dispose();
  };

  //---------------------------------------------------------------------------
  // _onLostALifeSoundStop
  //---------------------------------------------------------------------------
  Brickout.PlayState._onLostALifeSoundStop = function(soundSystem, sound) {
    if (this._areAnyLivesLeft()) {
      this._ready();
    } else {
      this._beginOutro();
    }
  };
  
  //---------------------------------------------------------------------------
  // _onPlayerBallCollide
  //---------------------------------------------------------------------------
  Brickout.PlayState._onPlayerBallCollide = function(playerSprite, ballSprite) {
    var n_angle = Brickout.Utils.CalcBallOffPlayerReboundAngle(playerSprite, ballSprite);
    ballSprite.entity.setAngle(n_angle);

    this._beginProgressions();
    m_numBricksClearedDuringPass = 0;
    
    Brickout.sndSys.play(Brickout.Sounds.Ids.PADDLE_HIT);
    
    //prep ball for color match effect
    this._handleColorMatchPrep(ballSprite.entity);
    
    //handle paddle buff effect
    this._handlePaddleBuffEffect();
  };
  
  //---------------------------------------------------------------------------
  // _onPlayerItemCollide
  //---------------------------------------------------------------------------
  Brickout.PlayState._onPlayerItemCollide = function(playerSprite, itemSprite) {
    var itemEntity = itemSprite.entity;
    if (!itemEntity) {
      return
    }
    
    if (itemEntity.itemData.itemCollectSoundKey) {
      Brickout.sndSys.play(itemEntity.itemData.itemCollectSoundKey);
    }
    
    var effect = itemEntity.itemData.effect;
    var effectRunner = m_effectRunnersByItemId[itemEntity.itemData.id];
    if (effectRunner !== undefined) {
      Brickout.PS_EffectLabel.Run(effect, this);
      effectRunner.Run(effect, this);
    }
    
    itemEntity.dispose();
  };
  
  //---------------------------------------------------------------------------
  // _onReadyComplete
  //---------------------------------------------------------------------------
  Brickout.PlayState._onReadyComplete = function(servingBall) {
    m_isPlayActive = true;
    if (servingBall) {
      this._serveBall(servingBall);
    } else {
      this.createBall();
    }
  };
  
  //---------------------------------------------------------------------------
  // _playBallCollideMetalSound
  //---------------------------------------------------------------------------
  Brickout.PlayState._playBallCollideMetalSound = function(ballEntity) {
    if (ballEntity.isBlitz) {
      Brickout.sndSys.play(Brickout.Sounds.Ids.METAL_BLOCK_BIG_BALL);
    } else {
      Brickout.sndSys.play(Brickout.Sounds.Ids.METAL_BLOCK);
    }
  };
  
  //---------------------------------------------------------------------------
  // _ready
  //---------------------------------------------------------------------------
  Brickout.PlayState._ready = function() {
    m_isPlayActive = false;
    m_ready.onReady.addOnce(this._onReadyComplete, this);
    m_ready.start();
  };
  
  //---------------------------------------------------------------------------
  // _removeBall
  //---------------------------------------------------------------------------
  Brickout.PlayState._removeBall = function(ball) {
    m_ballsGroup.removeChild(ball);
    ball.dispose();
  };
  
  //---------------------------------------------------------------------------
  // _removeLife
  //---------------------------------------------------------------------------
  Brickout.PlayState._removeLife = function() {
    this._setLives(Brickout.data.player.lives - 1);
  };
  
  //---------------------------------------------------------------------------
  // _removePlayer
  //---------------------------------------------------------------------------
  Brickout.PlayState._removePlayer = function() {
    m_isPlayActive = false;
    m_player = Brickout.Utils.DisposeResource(m_player);
    
    var playerData = Brickout.data.player;
    playerData.clearItemPoints();
    
    //remove some effects
    playerData.removeEffects(
      Brickout.Items.Keys.BLITZ_BALL,
      Brickout.Items.Keys.PADDLE_BUFF,
      Brickout.Items.Keys.PADDLE_NERF);
    
    playerData.bonusPointsIndex = 0;
  };
  
  //---------------------------------------------------------------------------
  // _resetNumServesRemainingForNextItem
  //---------------------------------------------------------------------------
  Brickout.PlayState._resetNumServesRemainingForNextItem = function() {
    var rnd = new Phaser.RandomDataGenerator();
    m_numServesRemainingForNextItem = rnd.integerInRange(Brickout.data.MIN_SAVES_PER_ITEM,
      Brickout.data.MAX_SAVES_PER_ITEM);
  };
  
  //---------------------------------------------------------------------------
  // _serveBall
  //---------------------------------------------------------------------------
  Brickout.PlayState._serveBall = function(ballEntity) {
    var levelData = Brickout.Levels.GetData(this.game, Brickout.data.player.level);
    ballEntity.setSpeed(levelData.ballSpeed);
    
    var n_angle = Brickout.Utils.CalcBallOffPlayerReboundAngle(m_player.spriteGroup, ballEntity.sprite);
    ballEntity.setAngle(n_angle);
    
    Brickout.sndSys.play(Brickout.Sounds.Ids.PADDLE_HIT);
  };
  
  //---------------------------------------------------------------------------
  // _setNextLevel
  //---------------------------------------------------------------------------
  Brickout.PlayState._setNextLevel = function() {
    this._setLevel(Brickout.data.player.level + 1);
  };

  //---------------------------------------------------------------------------
  // _setLevel
  //---------------------------------------------------------------------------
  Brickout.PlayState._setLevel = function(u_value) {
    Brickout.data.player.level = u_value;
    Brickout.data.player.brickDescendLevel = 0;
    m_levelBuilder.setLevel(u_value);
    m_ui.setLevel(u_value);
  };

  //---------------------------------------------------------------------------
  // _setLives
  //---------------------------------------------------------------------------
  Brickout.PlayState._setLives = function(u_value) {
    Brickout.data.player.lives = u_value;
    m_ui.setLives(u_value);
  };

  //---------------------------------------------------------------------------
  // _setScore
  //---------------------------------------------------------------------------
  Brickout.PlayState._setScore = function(u_value, b_isOffset) {
    var u_score = Brickout.data.player.score;
    if (b_isOffset === true) {
      u_score += u_value;
    } else {
      u_score = u_value;
    }
    
    Brickout.data.player.score = u_score;
    m_ui.setScore(u_score);
  };

  //---------------------------------------------------------------------------
  // _updateActivePlay
  //---------------------------------------------------------------------------
  Brickout.PlayState._updateActivePlay = function() {
    this._updateActivePlayCollisions();
    this._updateActivePlayBalls();
  };
  
  //---------------------------------------------------------------------------
  // _updateActivePlayBalls
  //---------------------------------------------------------------------------
  Brickout.PlayState._updateActivePlayBalls = function() {
    var a_balls = m_ballsGroup.children;
    for (var i_index = 0; i_index < a_balls.length; i_index++) {
      var ball = a_balls[i_index];
      ball.entity.update();
    }
  };
  
  //---------------------------------------------------------------------------
  // _updateActivePlayCollisions
  //---------------------------------------------------------------------------
  Brickout.PlayState._updateActivePlayCollisions = function() {
    var arcade = this.game.physics.arcade;
    var gameMap = Brickout.data.gameMap;
    arcade.collide(m_player.spriteGroup, gameMap.wallsLayer);
    arcade.collide(m_player.spriteGroup, m_ballsGroup, this._onPlayerBallCollide, null, this);
    arcade.collide(m_ballsGroup, gameMap.wallsLayer, this._onBallWallsCollide, null, this);
    arcade.collide(m_ballsGroup, gameMap.bricksGroup, this._onBallBrickCollide,
      this._onBallBrickProcess, this);
    arcade.collide(m_ballsGroup, gameMap.saverBricksGroup, this._onBallSaverBrickCollide, null, this);
    arcade.overlap(m_player.spriteGroup, m_itemsGroup, this._onPlayerItemCollide, null, this);
  };
})(window);