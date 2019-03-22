(function(global) {
  global.Brickout = global.Brickout || {};
  Brickout.PreloadState = Brickout.PreloadState || {};
  
  /////////////////////////////////////////////////////////////////////////////
  // public
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // create
  //---------------------------------------------------------------------------
  Brickout.PreloadState.create = function() {
    Brickout.Items.Init(this.game);
    Brickout.Sounds.Init(this.game);
    Brickout.sndSys = new Brickout.SoundSystem(this.game);
    this.state.start('IntroState');
  };

  //---------------------------------------------------------------------------
  // preload
  //---------------------------------------------------------------------------
  Brickout.PreloadState.preload = function() {
    var preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preload-bar');
    preloadBar.anchor.setTo(0.5);

    var loader = this.load;
    loader.setPreloadSprite(preloadBar);

    //------------------
    //sprite atlases
    loader.atlas('atlas', 'media/graphics/atlas.png', 'media/graphics/atlas.json', null,
      Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

    //------------------
    //tilemaps
    loader.tilemap('brickout', 'media/graphics/maps/brickout.json', null, Phaser.Tilemap.TILED_JSON);

    //tileset image
    loader.image('tilesetImage', 'media/graphics/maps/tileset.png');

    //------------------
    //fonts
    loader.bitmapFont('press2p24', 'media/graphics/fonts/press2p24.png',
                      'media/graphics/fonts/press2p24.fnt');
    
    //------------------
    //data
    loader.json('levelsData', 'data/levels.json');
    loader.json('itemsData', 'data/items.json');
    loader.json('soundsData', 'data/sounds.json');
    
    //------------------
    //audio
    addAudioFiles(loader);
  };
 
  /////////////////////////////////////////////////////////////////////////////
  // local
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // addAudioFile
  //---------------------------------------------------------------------------
  function addAudioFile(loader, s_key) {
    var PATH = "media/audio/";
    var FILE_EXT = ".mp3";
    loader.audio(s_key, PATH + s_key + FILE_EXT);
  }
  
  //---------------------------------------------------------------------------
  // addAudioFiles
  //---------------------------------------------------------------------------
  function addAudioFiles(loader) {
    audioFiles = Brickout.Sounds.AssetKeys;
    for (var i_index = 0; i_index < audioFiles.length; i_index++) {
      addAudioFile(loader, audioFiles[i_index]);
    }
  }
})(window);