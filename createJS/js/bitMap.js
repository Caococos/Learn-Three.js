const stage = new createjs.Stage('testCanvas')
const gameView = new createjs.Container()
stage.addChild(gameView)

const bitmap = new createjs.Bitmap('./img/bg.jpg')
gameView.addChild(bitmap)


createjs.Ticker.setFPS(30)
createjs.Ticker.addEventListener('tick', _ => {
  stage.update()
})