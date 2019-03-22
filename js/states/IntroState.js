(function(global) {
  global.Brickout = global.Brickout || {};
  Brickout.IntroState = Brickout.IntroState || {};
  
  var m_bgmIntroSound = null;
  
  /////////////////////////////////////////////////////////////////////////////
  // public
  /////////////////////////////////////////////////////////////////////////////
    
  //---------------------------------------------------------------------------
  // create
  //---------------------------------------------------------------------------
  Brickout.IntroState.create = function() {
    this._initBackgroundImage();
    
    //intro title
    this.game.add.image(197, 206, 'atlas', 'intro-title');
    
    //copy text
    this.game.add.bitmapText(568, 702, 'press2p24', 'GameplayCoder.com', 24);
    
    //start button
    this.game.add.button(428, 480, 'atlas', this._onStartButtonPressed, this, 'start-button-green',
      'start-button-blue', 'start-button-green-down', 'start-button-green');
      
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
})(window);