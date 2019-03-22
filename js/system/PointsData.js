(function(global) {
  global.Brickout = global.Brickout || {};
  
  var pointsData = Brickout.PointsData = {};
  pointsData[Brickout.BrickIds.GREEN] = 10;
  pointsData[Brickout.BrickIds.YELLOW] = 25;
  pointsData[Brickout.BrickIds.BLUE] = 17;
  pointsData[Brickout.BrickIds.PURPLE] = 20;
  pointsData[Brickout.BrickIds.RED] = 30;
  pointsData[Brickout.BrickIds.ORANGE] = 27;
  pointsData[Brickout.BrickIds.LIGHT_BLUE] = 15;
  pointsData[Brickout.BrickIds.CYAN] = 12;
  pointsData[Brickout.BrickIds.MAGENTA] = 22;
  
  /////////////////////////////////////////////////////////////////////////////
  // public
  /////////////////////////////////////////////////////////////////////////////
  
  /////////////////////////////////////////////////////////////////////////////
  // "static"
  /////////////////////////////////////////////////////////////////////////////
  Brickout.PointsData.GROWTH_RATE = 0.1;
  
  //---------------------------------------------------------------------------
  // GetPoints
  //---------------------------------------------------------------------------
  Brickout.PointsData.GetPoints = function(s_brickFrame) {
    return(pointsData[s_brickFrame] || 0);
  };
  
})(window);