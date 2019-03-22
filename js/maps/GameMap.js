(function(global) {
  global.Brickout = global.Brickout || {};
  
  /////////////////////////////////////////////////////////////////////////////
  // constructor
  /////////////////////////////////////////////////////////////////////////////
  Brickout.GameMap = function(game, s_tilemapKey, tilemapGroup, ui) {
    this.game = game;
    this.tileMap = game.add.tilemap(s_tilemapKey);
    this.bricksGroup = null;
    this.saverBricksGroup = null;
    
    //key: String (bitmap text name)
    //data: BitmapText
    this.textFields = { };
    this.txtScoreLabel = null;
    this.txtScoreValue = null;
    this.txtLivesLabel = null;
    this.txtLivesValue = null;
    this.txtLevelLabel = null;
    this.txtLevelValue = null;
    
    this._createBricksGroup();
    this._createSaverBricksGroup();
    
    this.playerStartPoint = null;
    this.ballStartLine = null;
    this.playerRangeLine = null;
    this.bricksStartLine = null;
    this.itemsStartLine = null;
    this.saverLine = null;
    
    this.bricksBottom = 0;
    this.brickMapperLayer = null;
    
    this.levelLayers = [];
    
    var map = this.tileMap;
    this.tileset = map.addTilesetImage('tileset', 'tilesetImage');
    
    var MAP_WIDTH = undefined;
    var MAP_HEIGHT = undefined;
    this.wallsLayer = map.createLayer('walls', MAP_WIDTH, MAP_HEIGHT, tilemapGroup);
    
    this.setCollisionTiles([1, 9], 12, [14, 24], 27);
    this._createObjects();
    this._createText(ui);
    this._createBrickMapper();
    this._initLevelLayers();
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // const
  /////////////////////////////////////////////////////////////////////////////
  Brickout.GameMap.BRICK_MAPPER_LAYER_NAME = 'brick-mapper';
  
  /////////////////////////////////////////////////////////////////////////////
  // public
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // clearAllBricks
  //---------------------------------------------------------------------------
  Brickout.GameMap.prototype.clearAllBricks = function() {
    for (var i_index = this.bricksGroup.children.length - 1; i_index >= 0; i_index--) {
      var brickEntity = this.bricksGroup.children[i_index].entity;
      this.clearBrick(brickEntity);
    }
  };
  
  //---------------------------------------------------------------------------
  // clearBrick
  //---------------------------------------------------------------------------
  Brickout.GameMap.prototype.clearBrick = function(brickEntity, b_createParticles) {
    if (brickEntity === undefined) {
      return;
    }
    
    var SHOULD_DESTROY = false;
    var IS_SILENT = true;
    this.bricksGroup.remove(brickEntity.sprite, SHOULD_DESTROY, IS_SILENT);
    
    brickEntity.clear(b_createParticles);
    
    var s_brickType = brickEntity.type;
    var a_freeBrickEntities = Brickout.data.freeBrickEntites[s_brickType];
    if (a_freeBrickEntities === undefined) {
      a_freeBrickEntities = Brickout.data.freeBrickEntites[s_brickType] = [];
    }
    
    a_freeBrickEntities.push(brickEntity);
  };
  
  //---------------------------------------------------------------------------
  // clearBricks
  //---------------------------------------------------------------------------
  Brickout.GameMap.prototype.clearBricks = function(a_bricks, b_createParticles) {
    var i_length = a_bricks.length;
    for (var i_index = 0; i_index < i_length; i_index++) {
      this.clearBrick(a_bricks[i_index], b_createParticles);
    }
  };
  
  //---------------------------------------------------------------------------
  // createBricks
  //---------------------------------------------------------------------------
  Brickout.GameMap.prototype.createBricks = function(u_level) {
    var map = this.tileMap;
    var group = new Phaser.Group(this.game, null);
    
    u_level = Math.max(u_level, 0) % this.levelLayers.length;
    var a_sourceObjects = this.levelLayers[u_level];
    if (!a_sourceObjects) {
      console.log('GameMap.createBricks. Warning: Invalid level index: ' + u_level);
      return;
    }

    map.setLayer(Brickout.GameMap.BRICK_MAPPER_LAYER_NAME);
    
    for (var u_index = 0; u_index < a_sourceObjects.length; u_index++) {
      var sourceObject = a_sourceObjects[u_index];
      var s_name = sourceObject.name;
      if (!s_name || s_name.indexOf('brickNodes') != 0) {
        continue;
      }
      
      var rect = createRect(sourceObject);
      for (var n_y = rect.y; n_y < rect.bottom; n_y += map.tileHeight) {
        for (var n_x = rect.x; n_x < rect.right; n_x += map.tileWidth) {
          this._createBrick(n_x, n_y);
        }
      }
    }
    
    return(true);
  };
  
  //---------------------------------------------------------------------------
  // clearSaverBrick
  //---------------------------------------------------------------------------
  Brickout.GameMap.prototype.clearSaverBrick = function(brickEntity) {
    if (brickEntity) {
      brickEntity.clear();
    }
  };
  
  //---------------------------------------------------------------------------
  // descend
  //---------------------------------------------------------------------------
  Brickout.GameMap.prototype.descend = function(b_createNewRow) {
    var b_loopLastRow = !b_createNewRow;
    this._descendExistingBricks(b_loopLastRow);
    
    if (b_createNewRow === true) {
      this._createNewRowOfBricks();
    }
  }
  
  //---------------------------------------------------------------------------
  // dispose
  //---------------------------------------------------------------------------
  Brickout.GameMap.prototype.dispose = function() {
    this.wallsLayer = Brickout.Utils.DestroyResource(this.wallsLayer);
    this.bricksGroup = Brickout.Utils.DestroyGroup(this.bricksGroup);
    this.saverBricksGroup = Brickout.Utils.DestroyGroup(this.saverBricksGroup);
    this.tileMap = Brickout.Utils.DestroyResource(this.tileMap);
    this.tileset = null;
    this.game = null;
  };
  
  //---------------------------------------------------------------------------
  // setCollisionTiles
  //---------------------------------------------------------------------------
  Brickout.GameMap.prototype.setCollisionTiles = function(...rest) {
    for (var index = 0; index < rest.length; index++) {
      if (typeof rest[index] === 'number') {
        this._setCollisionTile(rest[index]);
      } else if (Array.isArray(rest[index])) {
        this._setCollisionTiles(rest[index]);
      }
    }
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // "private"
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // _createBitmapText
  //---------------------------------------------------------------------------
  Brickout.GameMap.prototype._createBitmapText = function(textObject, ui) {
    var s_fontKey = textObject.type;
    var textProperties = textObject.text;
    ui[textObject.name] = this.game.add.bitmapText(textObject.x, textObject.y, s_fontKey, textProperties.text,
      textProperties.pixelsize, ui.group);
  };

  //---------------------------------------------------------------------------
  // _createBrick
  //---------------------------------------------------------------------------
  Brickout.GameMap.prototype._createBrick = function(n_x, n_y) {
    var TILE_WIDTH = undefined;
    var TILE_HEIGHT = undefined;
    var tile = this.tileMap.getTileWorldXY(n_x, n_y, TILE_WIDTH, TILE_HEIGHT,
      Brickout.GameMap.BRICK_MAPPER_LAYER_NAME);
    if (tile === null) {
      return;
    }
    
    var properties = tile.properties;
    
    var s_frame = properties.image;
    if (s_frame === undefined) {
      return;
    }
    
    var a_freeBrickEntities = Brickout.data.freeBrickEntites[s_frame];
    var brickEntity;
    if (a_freeBrickEntities !== undefined && a_freeBrickEntities.length > 0) {
      brickEntity = a_freeBrickEntities.pop();
      brickEntity.x(n_x).y(n_y).createBody();
    } else {
      var u_points = Brickout.PointsData.GetPoints(s_frame);
      brickEntity = new Brickout.BrickEntity(this.game, n_x, n_y, s_frame, u_points, properties.particleImage);
    }
    
    this.bricksGroup.add(brickEntity.sprite);
  };
  
  //---------------------------------------------------------------------------
  // _createBrickMapper
  //---------------------------------------------------------------------------
  Brickout.GameMap.prototype._createBrickMapper = function() {
    var PARENT = null;
    var NAME = undefined;
    var ADD_TO_STAGE = false;
    var group = this.game.make.group(PARENT, NAME, ADD_TO_STAGE);
    
    var WIDTH = undefined;
    var HEIGHT = undefined;
    this.brickMapperLayer = this.tileMap.createLayer(Brickout.GameMap.BRICK_MAPPER_LAYER_NAME, WIDTH, HEIGHT, group);
    if (this.brickMapperLayer === undefined) {
      console.log("GameMap._createBrickMapper. Warning: Unable to create layer '" +
                  Brickout.GameMap.BRICK_MAPPER_LAYER_NAME + "'");
      return(false);
    }
    
    return(true);
  };
  
  //---------------------------------------------------------------------------
  // _createBricksGroup
  //---------------------------------------------------------------------------
  Brickout.GameMap.prototype._createBricksGroup = function() {
    var PARENT = null;
    var NAME = 'bricksGroup';
    var ADD_TO_STAGE = false;
    this.bricksGroup = this.game.make.group(PARENT, NAME, ADD_TO_STAGE);
  };
  
  //---------------------------------------------------------------------------
  // _createNewRowOfBricks
  //---------------------------------------------------------------------------
  Brickout.GameMap.prototype._createNewRowOfBricks = function() {
    var n_y = this.bricksStartLine.y;
    for (var n_x = this.bricksStartLine.x; n_x <= this.bricksStartLine.right; n_x += this.tileMap.tileWidth) {
      this._createBrick(n_x, n_y);
    }
  };
  
  //---------------------------------------------------------------------------
  // _createObjects
  //---------------------------------------------------------------------------
  Brickout.GameMap.prototype._createObjects = function() {
    var a_sourceObjects = this.tileMap.objects.nodes;
    if (!a_sourceObjects) {
      return;
    }

    for (var u_index = 0; u_index < a_sourceObjects.length; u_index++) {
      var sourceObject = a_sourceObjects[u_index];
      var s_name = sourceObject.name;
      if (s_name == 'playerStart') {
        this.playerStartPoint = createPoint(sourceObject);
      } else if (s_name == 'ballStart') {
        this.ballStartLine = createLine(sourceObject);
      } else if (s_name == 'playerRange') {
        this.playerRangeLine = createLine(sourceObject);
      } else if (s_name == 'bricksBottom') {
        this.bricksBottom = createPoint(sourceObject).y;
      } else if (s_name == 'bricksStartRow') {
        this.bricksStartLine = createLine(sourceObject);
      } else if (s_name == 'itemsStartLine') {
        this.itemsStartLine = createLine(sourceObject);
      } else if (s_name == 'saverLine') {
        this.saverLine = createLine(sourceObject);
      }
    }
  };

  //---------------------------------------------------------------------------
  // _createSaverBricksGroup
  //---------------------------------------------------------------------------
  Brickout.GameMap.prototype._createSaverBricksGroup = function() {
    var PARENT = null;
    var NAME = 'saverBricksGroup';
    var ADD_TO_STAGE = false;
    this.saverBricksGroup = this.game.make.group(PARENT, NAME, ADD_TO_STAGE);
  };
  
  //---------------------------------------------------------------------------
  // _createText
  //---------------------------------------------------------------------------
  Brickout.GameMap.prototype._createText = function(ui) {
    var textLayer = this._getTextLayer('text');
    var a_textObjects = textLayer ? textLayer.objects : null;
    if (!a_textObjects) {
      return;
    }
    
    for (var u_index = 0; u_index < a_textObjects.length; u_index++) {
      var textObject = a_textObjects[u_index];
      var textProperties = textObject.text;
      if (textProperties === undefined) {
        continue;
      }
      
      var s_name = textObject.name || "";
      if (s_name.indexOf('txt') === 0) {
        this._createBitmapText(textObject, ui);
      }
    }
  };
  
  //--------------------------------------------------------------------------- 
  // _descendExistingBricks
  //---------------------------------------------------------------------------
  Brickout.GameMap.prototype._descendExistingBricks = function(b_loopLastRow) {
    var a_bricksToClearOrLoop = [];
    var i_index;
    for (i_index = this.bricksGroup.children.length - 1; i_index >= 0; i_index--) {
      var brickSprite = this.bricksGroup.children[i_index];
      var n_y = brickSprite.y + this.tileMap.tileHeight;
      if (n_y >= this.bricksBottom) {
        a_bricksToClearOrLoop.push(brickSprite.entity);
      } else {
        this._setBrickY(brickSprite.entity, n_y);
      }
    }
    
    if (b_loopLastRow === true) {
      this._loopBricks(a_bricksToClearOrLoop);
    } else {
      this.clearBricks(a_bricksToClearOrLoop);
    }
  };
  
  //--------------------------------------------------------------------------- 
  // _getTextLayer
  //---------------------------------------------------------------------------
  Brickout.GameMap.prototype._getTextLayer = function(s_layerName) {
    var rawMapData = this.game.cache.getTilemapData(this.tileMap.key);
    var a_layers = rawMapData.data.layers;
    for (var u_index = 0; u_index < a_layers.length; u_index++) {
      var layer = a_layers[u_index];
      if (layer.name === s_layerName) {
        return(layer);
      }
    }
    return(null);
  }

  //---------------------------------------------------------------------------
  // _initLevelLayers
  //---------------------------------------------------------------------------
  Brickout.GameMap.prototype._initLevelLayers = function() {
    var u_level = 0;
    var levelLayer = this.tileMap.objects['level' + u_level];
    while (levelLayer) {
      this.levelLayers.push(levelLayer);
      u_level++;
      levelLayer = this.tileMap.objects['level' + u_level];
    }
  }
  
  //---------------------------------------------------------------------------
  // _loopBricks
  //---------------------------------------------------------------------------
  Brickout.GameMap.prototype._loopBricks = function(a_brickEntities) {
    var i_length = a_brickEntities.length;
    for (var i_index = 0; i_index < i_length; i_index++) {
      var brickEntity = a_brickEntities[i_index];
      this._setBrickY(brickEntity, this.bricksStartLine.y);
    }
  };
  
  //--------------------------------------------------------------------------- 
  // _setBrickY
  //---------------------------------------------------------------------------
  Brickout.GameMap.prototype._setBrickY = function(brickEntity, n_y) {
    this._createBrick(brickEntity.x(), n_y);
    this.clearBrick(brickEntity);
  }
  
  //---------------------------------------------------------------------------
  // _setCollisionTile
  //---------------------------------------------------------------------------
  Brickout.GameMap.prototype._setCollisionTile = function(u_tileIndex) {
    this.tileMap.setCollision(u_tileIndex + this.tileset.firstgid, true, 'walls');
  };
  
  //---------------------------------------------------------------------------
  // _setCollisionTiles
  //---------------------------------------------------------------------------
  Brickout.GameMap.prototype._setCollisionTiles = function(au_tileIndexRanges) {
    if (au_tileIndexRanges.length < 2) {
      return;
    }
    
    var u_minTile = au_tileIndexRanges[0];
    var u_maxTile = au_tileIndexRanges[1];
    var u_firstgid = this.tileset.firstgid;
    this.tileMap.setCollisionBetween(u_minTile + u_firstgid, u_maxTile + u_firstgid, true, 'walls');
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // "local"
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // createLine
  //---------------------------------------------------------------------------
  function createLine(sourceObject) {
    var a_polyLinePoints = sourceObject.polyline;
    var x1 = sourceObject.x;
    return(new Phaser.Line(x1, sourceObject.y, x1 + a_polyLinePoints[1][0], sourceObject.y));
  }
  
  //---------------------------------------------------------------------------
  // createPoint
  //---------------------------------------------------------------------------
  function createPoint(sourceObject) {
    return(new Phaser.Point(sourceObject.x, sourceObject.y));
  }

  //---------------------------------------------------------------------------
  // createRect
  //---------------------------------------------------------------------------
  function createRect(sourceObject) {
    return(new Phaser.Rectangle(sourceObject.x, sourceObject.y, sourceObject.width, sourceObject.height));
  }
  
})(window);