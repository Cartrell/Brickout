(function(global) {
  global.Brickout = global.Brickout || {};
  Brickout.IntroState = Brickout.IntroState || {};
  
  var m_bgmIntroSound = null;
  var BTN_STATE_OUT = "Out";
  
  /////////////////////////////////////////////////////////////////////////////
  // public
  /////////////////////////////////////////////////////////////////////////////
    
  //---------------------------------------------------------------------------
  // create
  //---------------------------------------------------------------------------
  Brickout.IntroState.create = function() {
    this._initBackgroundImage();
    
    this.game.add.image(197, 206, 'atlas', 'intro-title');
    
    this._initTitleDisplays();
    this._initCreditsDisplays();
    
    var IS_CREDITS_MODE = false;
    this._setMode(IS_CREDITS_MODE);
    
    //play intro bgm
    this._playBgIntro();
  };

  //---------------------------------------------------------------------------
  // shutdown
  //---------------------------------------------------------------------------
  Brickout.IntroState.shutdown = function() {
    if (m_bgmIntroSound) {
      m_bgmIntroSound.stop();
      m_bgmIntroSound = null;
    }
  };

  /////////////////////////////////////////////////////////////////////////////
  // "private"
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // _initBackgroundImage
  //---------------------------------------------------------------------------
  Brickout.IntroState._initBackgroundImage = function() {
    var backgroundId = Brickout.Utils.GetRandomBackgroundId();
    var tileSprite = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'atlas',
      backgroundId);
    var COLORS  = [
      0xff0000,
      0x00ff00,
      0x0000ff,
      0xffff00,
      0xff00ff,
      0x00ffff
    ];
    
    var color = Phaser.ArrayUtils.getRandomItem(COLORS);
    tileSprite.tint = color;
  };
  
  //---------------------------------------------------------------------------
  // _initButtonLikeNode
  //---------------------------------------------------------------------------
  Brickout.IntroState._initButtonLikeNode = function(x, y, width, height, url, group) {
    var rectGraphics = this.game.add.graphics(x, y, group);
    
    var COLOR = 0xffffff;
    var ALPHA = 0;
    rectGraphics.beginFill(COLOR, ALPHA);
    rectGraphics.drawRect(0, 0, width, height);
    rectGraphics.endFill();
    
    rectGraphics.inputEnabled = true;
    rectGraphics.input.useHandCursor = true;
    rectGraphics.events.onInputUp.add(function(graphics, pointer, isOver) {
      if (isOver) {
        window.open(url, "_blank");
      }
    });
    
    return(rectGraphics);
  };
  
  //---------------------------------------------------------------------------
  // _initCreditsDisplays
  //---------------------------------------------------------------------------
  Brickout.IntroState._initCreditsDisplays = function() {
    this.creditsComponents = this.game.add.group();
    
    this.game.add.image(105, 351, 'atlas', 'credits-panel', this.creditsComponents);
    
    this._initButtonLikeNode(426, 370, 154, 32, "https://opengameart.org/content/arkanoid-pico-8-assets",
      this.creditsComponents);
    this._initButtonLikeNode(656, 370, 237, 32, "https://opengameart.org/", this.creditsComponents);
    this._initButtonLikeNode(291, 466, 131, 25, "https://opengameart.org/content/explosion-animations",
      this.creditsComponents);
    this._initButtonLikeNode(501, 466, 234, 25, "https://opengameart.org/", this.creditsComponents);
    this._initButtonLikeNode(394, 549, 69, 25, "http://creativecommons.org/publicdomain/zero/1.0/", this.creditsComponents);
    
    this.backButton = this.game.add.button(468, 660, 'atlas', this._onBackButtonPressed, this, 'back-button-green',
      'back-button-blue', 'back-button-green-down', 'back-button-green', this.creditsComponents);
  };
      
  //---------------------------------------------------------------------------
  // _initTitleDisplays
  //---------------------------------------------------------------------------
  Brickout.IntroState._initTitleDisplays = function() {
    this.titleComponents = this.game.add.group();
    
    this.copyText = this.game.add.bitmapText(568, 702, 'press2p24', 'GameplayCoder.com', 24, this.titleComponents);
    
    this.startButton = this.game.add.button(428, 480, 'atlas', this._onStartButtonPressed, this, 'start-button-green',
      'start-button-blue', 'start-button-green-down', 'start-button-green', this.titleComponents);
      
    this.creditsButton = this.game.add.button(428, 540, 'atlas', this._onCreditsButtonPressed, this, 'credits-button-green',
      'credits-button-blue', 'credits-button-green-down', 'credits-button-green', this.titleComponents);
  };
      
  //---------------------------------------------------------------------------
  // _onBackButtonPressed
  //---------------------------------------------------------------------------
  Brickout.IntroState._onBackButtonPressed = function() {
    var IS_CREDITS_MODE = false;
    this._setMode(IS_CREDITS_MODE);
  };
  
  //---------------------------------------------------------------------------
  // _onCreditsButtonPressed
  //---------------------------------------------------------------------------
  Brickout.IntroState._onCreditsButtonPressed = function() {
    var IS_CREDITS_MODE = true;
    this._setMode(IS_CREDITS_MODE);
  };
  
  //---------------------------------------------------------------------------
  // _onStartButtonPressed
  //---------------------------------------------------------------------------
  Brickout.IntroState._onStartButtonPressed = function() {
    var CLEAR_WORLD = true;
    var CLEAR_CACHE = false;
    this.state.start("PlayState", CLEAR_WORLD, CLEAR_CACHE);
  };
    
  //---------------------------------------------------------------------------
  // _playBgIntro
  //---------------------------------------------------------------------------
  Brickout.IntroState._playBgIntro = function() {
    m_bgmIntroSound = Brickout.sndSys.play(Brickout.Sounds.Ids.BGM_INTRO);
  };
  
  //---------------------------------------------------------------------------
  // _setMode
  //---------------------------------------------------------------------------
  Brickout.IntroState._setMode = function(isCreditsMode) {
    this.titleComponents.visible = !isCreditsMode;
    this.creditsComponents.visible = isCreditsMode;
    this.startButton.changeStateFrame(BTN_STATE_OUT);
    this.creditsButton.changeStateFrame(BTN_STATE_OUT);
    this.backButton.changeStateFrame(BTN_STATE_OUT);
  };
})(window);