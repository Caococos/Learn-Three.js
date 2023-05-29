let stage;
let text;
let rect;
let count = 0;

stage = new createjs.Stage('testCanvas')

text = new createjs.Text('text on the canvas... 0!', '36px Arial', '#fff')
text.x = 100
text.y = 100
text.rotation = 20
stage.addChild(text)

rect = new createjs.Shape()
rect.x = text.x
rect.y = text.y
rect.rotation = text.rotation
stage.addChildAt(rect)

createjs.Ticker.setFPS(30)
createjs.Ticker.addEventListener('tick', handlerTick)

function handlerTick (e) {
  count++;
  text.text = `text on the canvas... ${count}!`
  rect.graphics.clear().beginFill('#f00').drawRect(-10, -10, text.getMeasuredWidth()+20,50)
  stage.update(e)
}