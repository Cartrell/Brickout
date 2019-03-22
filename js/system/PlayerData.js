(function(global) {
  global.Brickout = global.Brickout || {};
  
  /////////////////////////////////////////////////////////////////////////////
  // constructor
  /////////////////////////////////////////////////////////////////////////////
  Brickout.PlayerData = function() {
    this.score = 0;
    this.lives = 0;
    this.level = NaN;
    this.brickDescendLevel = 0;
    this.numBricksToClearToDescend = 0;
    
    //key: string. brick entity frame
    //data: uint points
    this.itemsPoints = { };
    
    //data: EffectData
    this.effects = [];
    
    this.bonusPointsIndex = 0;
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // public
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // addEffect
  //---------------------------------------------------------------------------
  Brickout.PlayerData.prototype.addEffect = function(effectData) {
    var newEffectData = effectData.clone();
    this.effects.push(newEffectData);
    return(newEffectData);
  };
  
  //---------------------------------------------------------------------------
  // addItemPoint
  //---------------------------------------------------------------------------
  Brickout.PlayerData.prototype.addItemPoint = function(s_brickEntityFrame) {
    if (s_brickEntityFrame in this.itemsPoints === true) {
      this.itemsPoints[s_brickEntityFrame]++;
    } else {
      this.itemsPoints[s_brickEntityFrame] = 1;
    }
  };
  
  //---------------------------------------------------------------------------
  // clearItemPoints
  //---------------------------------------------------------------------------
  Brickout.PlayerData.prototype.clearItemPoints = function() {
    this.itemsPoints = { };
  };
  
  //---------------------------------------------------------------------------
  // containsEffect
  //---------------------------------------------------------------------------
  Brickout.PlayerData.prototype.containsEffect = function(s_itemId) {
    return(this.getEffect(s_itemId) != null);
  };
  
  //---------------------------------------------------------------------------
  // getEffect
  //---------------------------------------------------------------------------
  Brickout.PlayerData.prototype.getEffect = function(s_itemId) {
    var i_index = this._getEffectIndexOf(s_itemId);
    return(i_index > -1 ? this.effects[i_index] : null);
  };
  
  //---------------------------------------------------------------------------
  // getItemData
  //---------------------------------------------------------------------------
  Brickout.PlayerData.prototype.getItemData = function(s_brickEntityFrame) {
    var as_itemKeys = Brickout.Items.GetItemKeysByBrickEntityFrame(s_brickEntityFrame);
    var s_itemKey = Phaser.ArrayUtils.getRandomItem(as_itemKeys);
    return(Brickout.Items.GetData(s_itemKey));
  };
  
  //---------------------------------------------------------------------------
  // getRandomBrickEntityFrame
  //---------------------------------------------------------------------------
  Brickout.PlayerData.prototype.getRandomBrickEntityFrame = function() {
    var as_brickEntityFrames = [];
    var au_itemWeights = [];
    var u_totalWeight = 0;
    
    for (var s_brickEntityFrame in this.itemsPoints) {
      as_brickEntityFrames.push(s_brickEntityFrame);
      var u_itemWeight = this.itemsPoints[s_brickEntityFrame];
      u_totalWeight += u_itemWeight;
      au_itemWeights.push(u_itemWeight);
    }
    
    var u_target = Math.floor(Math.random() * u_totalWeight);
    
    var u_weight = 0;
    for (var u_index = 0; u_index < as_brickEntityFrames.length; u_index++) {
      u_weight += au_itemWeights[u_index];
      if (u_target < u_weight) {
        return(as_brickEntityFrames[u_index]);
      }
    }
    
    return(null);
  };
  
  //---------------------------------------------------------------------------
  // removeEffectData
  //---------------------------------------------------------------------------
  Brickout.PlayerData.prototype.removeEffectData = function(effectData) {
    for (var i_index = 0; i_index < this.effects.length; i_index++) {
      var existingEffectData = this.effects[i_index];
      if (existingEffectData === effectData) {
        this.effects.splice(i_index, 1);
        return;
      }
    }
  };
  
  //---------------------------------------------------------------------------
  // removeEffects
  //---------------------------------------------------------------------------
  Brickout.PlayerData.prototype.removeEffects = function(... as_itemIds) {
    for (var i_index = 0; i_index < as_itemIds.length; i_index++) {
      var s_itemId = as_itemIds[i_index];
      var i_effectIndex = this._getEffectIndexOf(s_itemId);
      if (i_effectIndex > -1) {
        this.effects.splice(i_effectIndex, 1);
      }
    }
  };
  
  //---------------------------------------------------------------------------
  // removeItemPointsByBrickFrame
  //---------------------------------------------------------------------------
  Brickout.PlayerData.prototype.removeItemPointsByBrickFrame = function(s_brickEntityFrame) {
    delete this.itemsPoints[s_brickEntityFrame];
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // "private"
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // _getEffectIndexOf
  //---------------------------------------------------------------------------
  Brickout.PlayerData.prototype._getEffectIndexOf = function(s_itemId) {
    for (var i_index = 0; i_index < this.effects.length; i_index++) {
      var effectData = this.effects[i_index];
      if (effectData.itemId === s_itemId) {
        return(i_index);
      }
    }
    return(-1);
  };
})(window);