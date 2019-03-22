(function(global) {
  global.Brickout = global.Brickout || {};
  Brickout.BackgroundIds = Brickout.BackgroundIds || {};
  
  /////////////////////////////////////////////////////////////////////////////
  // static / const
  /////////////////////////////////////////////////////////////////////////////
  Brickout.BackgroundIds.BRICKS = "back-bricks";
  Brickout.BackgroundIds.DIAMONDS = "back-diamonds";
  Brickout.BackgroundIds.HONEYCOMB = "back-honeycomb";
  Brickout.BackgroundIds.MECH = "back-mech";
  Brickout.BackgroundIds.STITCHES = "back-stitches";
  Brickout.BackgroundIds.TECH = "back-tech";
  
  /////////////////////////////////////////////////////////////////////////////
  // public
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // GetAllIds
  //---------------------------------------------------------------------------
  Brickout.BackgroundIds.GetAllIds = function() {
    var as_ids = [];
    for (var s_key in Brickout.BackgroundIds) {
      var s_id = Brickout.BackgroundIds[s_key];
      if (typeof(s_id) === 'string' && s_id.indexOf("back-") == 0) {
        as_ids.push(s_id);
      }
    }
    return(as_ids);
  };
})(window);