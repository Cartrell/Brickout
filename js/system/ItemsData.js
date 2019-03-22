(function(global) {
  global.Brickout = global.Brickout || {};
  Brickout.Items = Brickout.Items || {};
  
  Brickout.Items.Keys = { };
  Brickout.Items.Keys.BLITZ_BALL = "blitzBall";
  Brickout.Items.Keys.BOMB = "bomb";
  Brickout.Items.Keys.BONUS_POINTS = "bonusPoints";
  Brickout.Items.Keys.EXTRA_BALL = "extraBall";
  Brickout.Items.Keys.COLOR_BLAST = "colorBlast";
  Brickout.Items.Keys.COLOR_MATCH = "colorMatch";
  Brickout.Items.Keys.NEW_BALL = "newBall";
  Brickout.Items.Keys.PADDLE_BUFF = "paddleBuff";
  Brickout.Items.Keys.PADDLE_NERF = "paddleNerf";
  Brickout.Items.Keys.SAVER = "saver";
  Brickout.Items.Keys.SPEED_DOWN = "speedDown";
  Brickout.Items.Keys.SPEED_UP = "speedUp";
  
  /////////////////////////////////////////////////////////////////////////////
  // public
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // GetData
  //---------------------------------------------------------------------------
  Brickout.Items.GetData = function(s_itemId) {
    return(Brickout.Items.Data[s_itemId]);
  };
  
  //---------------------------------------------------------------------------
  // GetItemKeysByBrickEntityFrame
  //---------------------------------------------------------------------------
  Brickout.Items.GetItemKeysByBrickEntityFrame = function(s_brickEntityFrame) {
    var as_itemKeys = [];
    for (var s_itemKey in Brickout.Items.Data) {
      var itemData = Brickout.Items.Data[s_itemKey];
      if (itemData.brickKey === s_brickEntityFrame) {
        as_itemKeys.push(s_itemKey);
      }
    }
    return(as_itemKeys);
  };
  
  //---------------------------------------------------------------------------
  // GetKeys
  //---------------------------------------------------------------------------
  Brickout.Items.GetKeys = function() {
    return(_.keys(Brickout.Items.Data));
  };
  
  //---------------------------------------------------------------------------
  // Init
  //---------------------------------------------------------------------------
  Brickout.Items.Init = function(game) {
    if (Brickout.Items.Data === undefined) {
      Brickout.Items.Data = createItemsData(game);
    }
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // "local"
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // createItemsData
  //---------------------------------------------------------------------------
  function createItemsData(game) {
    var sourceData = game.cache.getJSON('itemsData');
    var destData = {};
    for (var s_key in sourceData) {
      destData[s_key] = new Brickout.ItemData(s_key, sourceData[s_key]);
    }
    
    return(destData);
  }
})(window);