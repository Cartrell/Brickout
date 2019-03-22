(function(global) {
  global.Brickout = global.Brickout || {};
  
  /////////////////////////////////////////////////////////////////////////////
  // static / const
  /////////////////////////////////////////////////////////////////////////////
  Brickout.BrickIds = {};
  Brickout.BrickIds.GREEN = "block-green";
  Brickout.BrickIds.YELLOW = "block-yellow";
  Brickout.BrickIds.BLUE = "block-blue";
  Brickout.BrickIds.PURPLE = "block-purple";
  Brickout.BrickIds.RED = "block-red";
  Brickout.BrickIds.ORANGE = "block-orange";
  Brickout.BrickIds.LIGHT_BLUE = "block-light-blue";
  Brickout.BrickIds.CYAN = "block-cyan";
  Brickout.BrickIds.MAGENTA = "block-magenta";
  
  /////////////////////////////////////////////////////////////////////////////
  // public
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // GetAllIds
  //---------------------------------------------------------------------------
  Brickout.BrickIds.GetAllIds = function() {
    var as_ids = [];
    for (var s_key in Brickout.BrickIds) {
      if (s_key.indexOf("block-") == 0) {
        as_ids.push(s_key);
      }
    }
    return(as_ids);
  };
})(window);