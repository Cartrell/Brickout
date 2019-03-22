(function(global) {
  global.Brickout = global.Brickout || {};
  Brickout.PS_ColorBlastEffect = Brickout.PS_ColorBlastEffect || { };
  
  var m_bricksClearer = null;
  
  /////////////////////////////////////////////////////////////////////////////
  // public
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // Run
  //---------------------------------------------------------------------------
  Brickout.PS_ColorBlastEffect.Run = function(effectData, iPlayState) {
    if (!m_bricksClearer) {
      m_bricksClearer = new Brickout.PS_SequentialBricksClearer(iPlayState);
    }
    
    clearMostCommonBricks(effectData, iPlayState);
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // "local"
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // clearMostCommonBricks
  //---------------------------------------------------------------------------
  function clearMostCommonBricks(effectData, iPlayState) {
    var a_brickEntities = getMostCommonBricks();
    m_bricksClearer.start(a_brickEntities);
  }
  
  //---------------------------------------------------------------------------
  // getMostCommonBricks
  //---------------------------------------------------------------------------
  function getMostCommonBricks() {
    //key: string (brick frame type)
    //data: int (number of bricks of this frame type)
    var bricksCountByFrame = {
      _highest:  {
        count: 0,
        frame: ""
      }
    };
    
    var gameMap = Brickout.data.gameMap;
    var CHECK_EXISTS = false;
    gameMap.bricksGroup.forEach(onCountBrickType, this, CHECK_EXISTS, bricksCountByFrame);
    
    var a_bricks = [];
    gameMap.bricksGroup.forEach(onGetHighestBrickType, this, CHECK_EXISTS, a_bricks,
      bricksCountByFrame._highest.frame);
    
    return(a_bricks);
  }
  
  //---------------------------------------------------------------------------
  // onCountBrickType
  //---------------------------------------------------------------------------
  function onCountBrickType(brickSprite, bricksCountByFrame) {
    var brickEntity = brickSprite.entity;
    var s_frame = brickEntity.frame;
    var u_count = bricksCountByFrame[s_frame] || 0;
    u_count++;
    bricksCountByFrame[s_frame] = u_count;
    
    if (u_count > bricksCountByFrame._highest.count) {
      bricksCountByFrame._highest.count = u_count;
      bricksCountByFrame._highest.frame = s_frame;
    }
  }
  
  //---------------------------------------------------------------------------
  // onGetHighestBrickType
  //---------------------------------------------------------------------------
  function onGetHighestBrickType(brickSprite, a_bricks_out, s_frame) {
    var brickEntity = brickSprite.entity;
    if (brickEntity.frame == s_frame) {
      a_bricks_out.push(brickEntity);
    }
  }
})(window);
