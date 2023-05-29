const stage = new createjs.Stage('gameView')
const tweens = []
const circleCount = 25
let activeCount;

for (let index = 0; index < circleCount; index++) {
  const circle = new createjs.Shape()
  circle.graphics.setStrokeStyle(15)   //空心圆距离
  circle.graphics.beginStroke('#113355')
  circle.graphics.drawCircle(0,0,(index+1)*4)

  circle.compositeOperation = 'lighter'

  const tween = createjs.Tween.get(circle)
    .to({x:300,y:200},(0.5+index*0.04)*1500, createjs.Ease.bounceOut).call(tweenComplete)
  tweens.push({
    tween,
    ref: circle
  })
  stage.addChild(circle)
}

activeCount = circleCount
stage.addEventListener('stagemouseup', handlerMouseup)
createjs.Ticker.addEventListener('tick', stage)

function handlerMouseup (e) {
  for (let index = 0; index < circleCount; index++) {
    const ref = tweens[index].ref
    createjs.Tween.get(ref, { override: true }).to({
      x:e.stageX,y:e.stageY},
      (0.5+index*0.04)*1500,createjs.Ease.bounceOut).call(tweenComplete)
  }
  activeCount = circleCount
}

function tweenComplete () {
  activeCount--
}