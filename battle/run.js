$(function () {
    var FPS = 50;
    
    var CANVAS_ID = 'canvas';
    var ctx = createCanvasContext();
    ctx.font = "16px prstart"
    
    var eventManager = new EventManager();
    var keyboard = new Keyboard(eventManager);
    var sceneManager = new SceneManager(eventManager);
    sceneManager.toLoadingScene();
    
    setInterval(gameLoop, 1000 / FPS);
    
    function gameLoop() {
      keyboard.fireEvents();
      sceneManager.update();
      sceneManager.draw(ctx);
    }
    
    function createCanvasContext() {
      $('<canvas id="' + CANVAS_ID + '" width="' + Globals.CANVAS_WIDTH + '" height="' + Globals.CANVAS_HEIGHT + '"></canvas>').prependTo('#main');
      var canvas = document.getElementById(CANVAS_ID);
      return canvas.getContext('2d');
    };
  });