/////////////////////////////////////////////////////////////////////////////
// entry
/////////////////////////////////////////////////////////////////////////////
var Brickout = (function(global) {
  global.Brickout = global.Brickout || {};
  
  Brickout.data = {
    MAX_LEVELS: 20,
    
    START_LEVEL: 0,
    START_LIVES: 3,
    
    MIN_SAVES_PER_ITEM: 1,
    MAX_SAVES_PER_ITEM: 12, 
    
    gameMap: null,
    player: new Brickout.PlayerData(),
    
    //key: string. phaser sprite frame
    //data: array of Phaser.BrickEntity objects of using the specified sprite frame
    freeBrickEntites: {}
  };
  
  var GAME_WIDTH = 1024;
  var GAME_HEIGHT = 768;
  Brickout.game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO);
  Brickout.game.state.add("BootState", Brickout.BootState);
  Brickout.game.state.add("IntroState", Brickout.IntroState);
  Brickout.game.state.add("PlayState", Brickout.PlayState);
  Brickout.game.state.add("PreloadState", Brickout.PreloadState);
  Brickout.game.state.add("OutroState", Brickout.OutroState);

  Brickout.game.state.start("BootState");

  return(Brickout);
})(window);
