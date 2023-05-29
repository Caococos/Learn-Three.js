const stage = new createjs.Stage('testCanvas')

createjs.Ticker.setFPS(60)
createjs.Ticker.addEventListener('tick', stage)

const mc = new createjs.MovieClip({loop:-1,labels:{start:50,stop:0}})
stage.addChild(mc)

const state1 = new createjs.Shape(new createjs.Graphics().beginFill('#999999').drawCircle(0,100,30))
const state2 = new createjs.Shape(new createjs.Graphics().beginFill('#000').drawCircle(0, 100, 30))

// The duration of the tween in milliseconds (or in ticks if useTicks is true).
mc.timeline.addTween(createjs.Tween.get(state1).to({x:30}).to({x:400},100).to({x:30},100))
// mc.timeline.addTween(createjs.Tween.get(state2).to({ x: 400 }).to({ x: 30 }, 1000).to({ x: 400 }, 100))

mc.gotoAndPlay('stop')