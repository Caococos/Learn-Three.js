let stage, container, canvas
canvas = document.querySelector('#gameView')
stage = new createjs.Stage(canvas)
container = new createjs.Container()

stage.addChild(container)
container.x = 120
container.y = 100

const content = new createjs.DOMElement('div')
container.addChild(content)

stage.update()
