(function(global) {
  global.Brickout = global.Brickout || {};
  Brickout.Levels = Brickout.Levels || {};
  
  /////////////////////////////////////////////////////////////////////////////
  // public
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // GetData
  //---------------------------------------------------------------------------
  Brickout.Levels.GetData = function(game, u_level) {
    if (Brickout.Levels.Data === undefined) {
      Brickout.Levels.Data = createLevelsData(game);
    }
    
    var a_levelsData = Brickout.Levels.Data;
    if (a_levelsData.length === 0) {
      return(null);
    }
    
    u_level = Math.max(u_level, 0) % a_levelsData.length;
    return(typeof u_level === 'number' ? a_levelsData[u_level] : null);
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // "local"
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // createLevelsData
  //---------------------------------------------------------------------------
  function createLevelsData(game) {
    var a_jData = game.cache.getJSON('levelsData');
    var a_destData = [];
    for (var i_index = 0; i_index < a_jData.length; i_index++) {
      a_destData.push(new Brickout.LevelData(a_jData[i_index]));
    }
    
    return(a_destData);
  }
  
})(window);