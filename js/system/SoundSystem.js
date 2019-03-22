(function(global) {
  global.Brickout = global.Brickout || {};
  
  /////////////////////////////////////////////////////////////////////////////
  // constructor
  /////////////////////////////////////////////////////////////////////////////
  Brickout.SoundSystem = function(game) {
    this.soundManager = game.sound;
    this._addSounds();
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // public
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // play
  //---------------------------------------------------------------------------
  Brickout.SoundSystem.prototype.play = function(s_soundId, f_onStop, callbackContext) {
    var soundData = Brickout.Sounds.GetData(s_soundId);
    if (!soundData) {
      console.log("Brickout.SoundSystem.play. Warning: Invalid sound id: " + s_soundId);
      return(null);
    }
    
    var s_assetKey = this._getAssetKey(soundData.assetKeys);
    if (s_assetKey === null) {
      console.log("Brickout.SoundSystem.play. Warning: No asset keys for sound id: " + s_soundId);
      return(null);
    }
    
    var sound = this.soundManager.play(s_assetKey);
    sound.brickout = {
      id: s_soundId,
      onStop: f_onStop,
      context: callbackContext || this
    };
    
    sound.onStop.addOnce(this._soundOnStop);
    return(sound);
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // "private"
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // _addSounds
  //---------------------------------------------------------------------------
  Brickout.SoundSystem.prototype._addSounds = function() {
    var assetKeys = Brickout.Sounds.AssetKeys;
    for (var i_index = 0; i_index < assetKeys.length; i_index++) {
      this.soundManager.add(assetKeys[i_index]);
    }
  };
  
  //---------------------------------------------------------------------------
  // _getAssetKey
  //---------------------------------------------------------------------------
  Brickout.SoundSystem.prototype._getAssetKey = function(assetKeys) {
    if (typeof assetKeys === "string") {
      return(assetKeys);
    }
    
    if (!Array.isArray(assetKeys)) {
      return(null);
    }
    
    return(Phaser.ArrayUtils.getRandomItem(assetKeys));
  };
  
  //---------------------------------------------------------------------------
  // _soundOnStop
  //---------------------------------------------------------------------------
  Brickout.SoundSystem.prototype._soundOnStop = function(sound) {
    var customData = sound.brickout;
    if (!customData) {
      return;
    }
    
    var f_onStop = customData.onStop;
    if (typeof f_onStop === "function") {
      f_onStop.apply(customData.context, [ this, sound ]);
    }
  };
  
})(window);
