(function(global) {
  global.Brickout = global.Brickout || {};
  Brickout.Sounds = Brickout.Sounds || {};
  
  /////////////////////////////////////////////////////////////////////////////
  // sound ids
  /////////////////////////////////////////////////////////////////////////////
  Brickout.Sounds.Ids = { };
  Brickout.Sounds.Ids.BGM_INTRO = "bgmIntro";
  Brickout.Sounds.Ids.BOMB_EXPLODE = "bombExplode";
  Brickout.Sounds.Ids.BRICKS_DESCEND = "bricksDescend";
  Brickout.Sounds.Ids.BRICKS_SHATTERED = "bricksShattered";
  Brickout.Sounds.Ids.BRICK_BREAK = "brickBreak";
  Brickout.Sounds.Ids.LOST_A_BALL = "lostBall";
  Brickout.Sounds.Ids.LOST_A_LIFE = "lostLife";
  Brickout.Sounds.Ids.METAL_BLOCK = "metalBlock";
  Brickout.Sounds.Ids.METAL_BLOCK_BIG_BALL = "metalBlockBigBall";
  Brickout.Sounds.Ids.PADDLE_HIT = "paddleHit";
  Brickout.Sounds.Ids.GAME_OVER = "gameOver";
  Brickout.Sounds.Ids.ITEM_COLLECT_SPEED_UP = "itemCollectSpeedUp";
  Brickout.Sounds.Ids.ITEM_COLLECT_SPEED_DOWN = "itemCollectSpeedDown";
  Brickout.Sounds.Ids.ITEM_COLLECT_BOMB_PUT = "itemCollectBombPut";
  Brickout.Sounds.Ids.ITEM_COLLECT_COLOR_BLAST = "itemCollectColorBlast";
  Brickout.Sounds.Ids.ITEM_COLLECT_EXTRA_BALL = "itemCollectExtraBall";
  Brickout.Sounds.Ids.ITEM_COLLECT_NEW_BALL = "itemCollectNewBall";
  Brickout.Sounds.Ids.ITEM_COLLECT_POINTS0 = "bonusPoints0";
  Brickout.Sounds.Ids.ITEM_COLLECT_POINTS1 = "bonusPoints1";
  Brickout.Sounds.Ids.ITEM_COLLECT_POINTS2 = "bonusPoints2";
  Brickout.Sounds.Ids.ITEM_COLLECT_POINTS3 = "bonusPoints3";
  Brickout.Sounds.Ids.ITEM_COLLECT_POINTS4 = "bonusPoints4";
  Brickout.Sounds.Ids.ITEM_COLLECT_POINTS5 = "bonusPoints5";
  Brickout.Sounds.Ids.ITEM_COLLECT_POINTS6 = "bonusPoints6";
  Brickout.Sounds.Ids.ITEM_COLLECT_POINTS7 = "bonusPoints7";
  Brickout.Sounds.Ids.ITEM_COLLECT_POINTS8 = "bonusPoints8";
  Brickout.Sounds.Ids.ITEM_COLLECT_POINTS9 = "bonusPoints9";
  Brickout.Sounds.Ids.ITEM_COLLECT_BLITZ_BALL = "itemCollectBlitzBall";
  Brickout.Sounds.Ids.ITEM_COLLECT_COLOR_MATCH = "itemCollectColorMatch";
  Brickout.Sounds.Ids.ITEM_COLLECT_PADDLE_BUFF = "itemCollectPaddleBuff";
  Brickout.Sounds.Ids.ITEM_COLLECT_PADDLE_NERF = "itemCollectPaddleNerf";
  Brickout.Sounds.Ids.ITEM_COLLECT_SAVER = "itemCollectSaver";
  Brickout.Sounds.Ids.SAVER_BRICK_BREAK = "saverBrickBreak";
  
  /////////////////////////////////////////////////////////////////////////////
  // sound asset keys (phaser loads these individual sound files of the same names, plus an mp3 ext)
  /////////////////////////////////////////////////////////////////////////////
  Brickout.Sounds.AssetKeys = [
    "bgm-intro",
    "bomb-explode0",
    "bomb-explode1",
    "bonus-points0",
    "bonus-points1",
    "bonus-points2",
    "bonus-points3",
    "bonus-points4",
    "bonus-points5",
    "bonus-points6",
    "bonus-points7",
    "bonus-points8",
    "bonus-points9",
    "brick-break-a",
    "brick-break-ab",
    "brick-break-b",
    "brick-break-bb",
    "brick-break-c",
    "brick-break-d",
    "brick-break-db",
    "brick-break-e",
    "brick-break-eb",
    "brick-break-f",
    "brick-break-g",
    "brick-break-gb",
    "bricks-descend-cm7",
    "bricks-descend-fm7",
    "bricks-descend-gm7",
    "bricks-descend-gm7-jz",
    "bricks-shattered0",
    "bricks-shattered1",
    "game-over0",
    "game-over1",
    "game-over2",
    "game-over3",
    "game-over4",
    "game-over5",
    "game-over6",
    "item-collect-blitz-ball",
    "item-collect-bomb-put",
    "item-collect-color-blast",
    "item-collect-color-match",
    "item-collect-extra-ball",
    "item-collect-new-ball",
    "item-collect-paddle-buff",
    "item-collect-paddle-nerf",
    "item-collect-saver",
    "item-collect-speed-down",
    "item-collect-speed-up",
    "lost-a-life",
    "lost-a-ball",
    "metal-block",
    "metal-block-big-ball",
    "paddle-hit",
    "saver-brick-break"
  ];
  
  /////////////////////////////////////////////////////////////////////////////
  // public
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // GetData
  //---------------------------------------------------------------------------
  Brickout.Sounds.GetData = function(s_soundId) {
    return(Brickout.Sounds.Data[s_soundId]);
  };
  
  //---------------------------------------------------------------------------
  // GetIds
  //---------------------------------------------------------------------------
  Brickout.Sounds.GetIdss = function() {
    return(_.keys(Brickout.Sounds.Data));
  };
  
  //---------------------------------------------------------------------------
  // Init
  //---------------------------------------------------------------------------
  Brickout.Sounds.Init = function(game) {
    if (Brickout.Sounds.Data === undefined) {
      Brickout.Sounds.Data = createData(game);
    }
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // "local"
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // createData
  //---------------------------------------------------------------------------
  function createData(game) {
    var sourceData = game.cache.getJSON('soundsData');
    var destData = {};
    for (var s_soundId in sourceData) {
      destData[s_soundId] = new Brickout.SoundData(s_soundId, sourceData[s_soundId]);
    }
    
    return(destData);
  }
})(window);