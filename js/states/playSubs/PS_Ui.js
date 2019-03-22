(function(global) {
  global.Brickout = global.Brickout || {};
  
  /////////////////////////////////////////////////////////////////////////////
  // constructor
  /////////////////////////////////////////////////////////////////////////////
  Brickout.PS_Ui = function(uiGroup) {
    this.group = uiGroup;
    this.txtScoreLabel = null;
    this.txtScoreValue = null;
    this.txtLivesLabel = null;
    this.txtLivesValue = null;
    this.txtLevelLabel = null;
    this.txtLevelValue = null;
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // public
  /////////////////////////////////////////////////////////////////////////////
  
  //---------------------------------------------------------------------------
  // setLevel
  //---------------------------------------------------------------------------
  Brickout.PS_Ui.prototype.setLevel = function(u_value) {
    if (this.txtLevelValue !== null) {
      this.txtLevelValue.text = u_value + 1;
    }
  };
  
  //---------------------------------------------------------------------------
  // setLives
  //---------------------------------------------------------------------------
  Brickout.PS_Ui.prototype.setLives = function(u_value) {
    if (this.txtLivesValue !== null) {
      this.txtLivesValue.text = u_value;
    }
  };
  
  //---------------------------------------------------------------------------
  // setScore
  //---------------------------------------------------------------------------
  Brickout.PS_Ui.prototype.setScore = function(u_value) {
    if (this.txtScoreValue !== null) {
      this.txtScoreValue.text = u_value;
    }
  };
  
  /////////////////////////////////////////////////////////////////////////////
  // "private"
  /////////////////////////////////////////////////////////////////////////////
  
})(window);