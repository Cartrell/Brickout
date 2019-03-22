(function(global) {
  global.Brickout = global.Brickout || {};
  Brickout.Utils = Brickout.Utils || {};
  
  /////////////////////////////////////////////////////////////////////////////
  // public
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // CalcBallOffPlayerReboundAngle
  //---------------------------------------------------------------------------
  Brickout.Utils.CalcBallOffPlayerReboundAngle = function(playerSprite, ballSprite) {
    if (!playerSprite || !ballSprite) {
      return(NaN);
    }
    
    var n_ballCx = ballSprite.body.center.x;
    var n_ballX1 = ballSprite.body.left;
    var n_playerCx = playerSprite.body.center.x;
    var n_playerX1 = playerSprite.body.left;
    var n_playerX2 = playerSprite.body.right;
    var n_time;
    var n_angle;
    
    if (n_ballCx > n_playerCx) {
      //ball hit the right side of the player paddle
      n_ballCx = Math.min(n_ballCx, n_playerX2);
      n_time = 1 - ((n_ballCx - n_playerCx) / (n_playerX2 - n_playerCx));
      n_angle = Phaser.Math.linear(15, 85, n_time);
    } else if (n_ballCx < n_playerCx) {
      //ball hit the left side of the player paddle
      n_ballCx = Math.max(n_ballCx, n_playerX1);
      n_time = 1 - ((n_ballCx - n_playerX1) / (n_playerCx - n_playerX1));
      n_angle = Phaser.Math.linear(95, 165, n_time);
    } else {
      //ball hit the middle of the player paddle
      n_angle = Math.random() >= 0.5 ? 91 : 89;
    }
    
    return(n_angle);
  };
  
  //---------------------------------------------------------------------------
  // CalcNumBricksToClearToDescend
  //---------------------------------------------------------------------------
  Brickout.Utils.CalcNumBricksToClearToDescend = function(game, u_dataLevel, u_brickDescendLevel) {
    var levelData = Brickout.Levels.GetData(game, u_dataLevel);
    if (levelData === null) {
      return(0);
    }
    if (levelData.numBricksToClearToDescend < 0) {
      return(0); //this level does not descend bricks
    }
    
    var u_value = levelData.numBricksToClearToDescend - levelData.bricksDescensionRate *
      u_brickDescendLevel;
    return(Math.max(u_value, 1));
  };
  
  //---------------------------------------------------------------------------
  // DestroyGroup
  //---------------------------------------------------------------------------
  Brickout.Utils.DestroyGroup = function(group, b_shouldDestroyChildren, b_isSoft) {
    if (group) {
      group.destroy(b_shouldDestroyChildren, b_isSoft);
    }
    
    return(null);
  };
  
  //---------------------------------------------------------------------------
  // DestroyResource
  //---------------------------------------------------------------------------
  Brickout.Utils.DestroyResource = function(resource) {
    if (resource) {
      resource.destroy();
    }
    
    return(null);
  };
  
  //---------------------------------------------------------------------------
  // DisposeResource
  //---------------------------------------------------------------------------
  Brickout.Utils.DisposeResource = function(resource) {
    if (resource) {
      resource.dispose();
    }
    
    return(null);
  };
  
  //---------------------------------------------------------------------------
  // GetRandomBackgroundId
  //---------------------------------------------------------------------------
  Brickout.Utils.GetRandomBackgroundId = function() {
    var as_backgroundIds = Brickout.BackgroundIds.GetAllIds();
    var i_rndIndex = Math.floor(Math.random() * as_backgroundIds.length);
    return(as_backgroundIds[i_rndIndex]);
  };
  
  //---------------------------------------------------------------------------
  // RectsIntersect
  //---------------------------------------------------------------------------
  Brickout.Utils.RectsIntersect = function(rect1, rect2) {
    if (rect1.width <= 0 || rect1.height <= 0 || rect2.width <= 0 || rect2.height <= 0) {
      retur(false);
    }

    return(!(rect1.right - 1 < rect2.x ||
      rect1.bottom - 1 < rect2.y ||
      rect1.x > rect2.right - 1 ||
      rect1.y > rect2.bottom - 1));
  };
  
  //---------------------------------------------------------------------------
  // ResetData
  //---------------------------------------------------------------------------
  Brickout.Utils.ResetData = function() {
    Brickout.data.gameMap = Brickout.Utils.DisposeResource(Brickout.data.gameMap);
    Brickout.data.player = new Brickout.PlayerData();
  };
  
  //---------------------------------------------------------------------------
  // Tremor
  //---------------------------------------------------------------------------
  Brickout.Utils.Tremor = function(camera, u_intensityPx, u_durationMs) {
    if (!camera) {
      return;
    }
    
    //The intensity of the camera shake is a percentage of the camera width (in pixels). However, in the
    // case of this game, pixels are easier for me to conceptualize, so the percentage can be calculated by:
    // [desired intensity, in pixels] / [camera width]
    var INTENSITY_PX = u_intensityPx !== undefined ? u_intensityPx : 4;
    var INTENSITY = INTENSITY_PX / camera.width;
    var DURATION_MS = u_durationMs !== undefined ? u_durationMs : 350;
    camera.shake(INTENSITY, DURATION_MS);
  };
})(window); 