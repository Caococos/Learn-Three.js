import { throttle, MAX_ATTACK_RANGE, INIT_ATTACK_RANGE, BULLET_COUNT,BULLET_SPEED } from './common.js'
class Game {
  constructor(ctx) {
    this.ctx = ctx
    this.stage = new createjs.Stage(this.ctx)
    this.width = this.stage.canvas.width
    this.allAmg = [{
      id: "bg",
      src: "./img/bg.jpg"
    }
    ]
  }
  init() {
    this.background()
    this.Monster2()
    this.role()
    this.jump()
    this.move()
    this.Monster1()
    this.attackSystem()
    this.updated()
    // this.resize()
  }
  role() {
    const rolesSheet = new createjs.SpriteSheet({
      // images: ['./img/spritesheet_man.png'],
      images: ['./img/role.png'],
      frames: {width:214,height:165,regX:214},
      animations: {
        walk: [35, 41, 'walk', 0.2], //strat,end,next,speed  以几倍的速度播放
        attack: [21, 34, 'walk', 0.3],
        death: [0,20,'',0.2]
      }
    })
    rolesSheet.on('complete', event => console.log('Complete ===>', event))
    rolesSheet.on('error', error => console.log('Error ===>', error))
    const role = new createjs.Sprite(rolesSheet, 'walk')
    this.man = new createjs.Container()
    this.man.name = 'role'
    this.man.way = 'down'
    this.man.addChild(role)
    this.man.x = 214
    this.man.y = 175
    this.stage.addChild(this.man)
    role.addEventListener('animationend', e => {
      if (e.name === 'death') {
        confirm('YOU DEATH!')
        this.stage.removeChild(this.monster1)
        this.Monster1()
        this.man.children[0].gotoAndPlay('walk')
      }
    })
  }
  jump() {
    const attack = document.querySelector('.attack')
    const jump = document.querySelector('.jump')
    const gotoPlay = throttle(this.man.children[0].gotoAndPlay, 600)
    const arrowHandler = throttle(this.addArrow, 600)
    
    window.addEventListener('keyup', (e) => {
      // 跳跃
      if (this.man.children[0].currentAnimation === 'walk' && e.key === '0') {
        createjs.Tween.get(this.man, { override: true })
          .to({y:100},300,createjs.Ease.circOut)
          .to({y:175},200,createjs.Ease.circIn)
      }
      // 攻击
      if (e.key === 'Enter' && this.man.children[0].currentAnimation === 'walk') {
        this.man.way === 'down' ? arrowHandler.call(this,240) : arrowHandler.call(this,190)
        gotoPlay.call(this.man.children[0],'attack')
      }

    })
    jump.addEventListener('click', _ => {
      createjs.Tween.get(this.man, { override: true })
          .to({y:100},300)
          .to({y:175},200)
    })
    attack.addEventListener('click', _ => {
      arrowHandler.call(this)
      gotoPlay.call(this.man.children[0],'attack')
    })
  }
  move() {
    const left = document.querySelector('.left')
    const right = document.querySelector('.right')
    left.addEventListener('click', _ => {
      this.stage.getChildByName('role').x -= 7
    })
    right.addEventListener('click', _ => {
      this.stage.getChildByName('role').x += 7
    })
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' && this.stage.getChildByName('role').x > 0 && 'ArrowLeft') {
        this.stage.getChildByName('role').x -= 7
      }
      if (e.key === 'ArrowRight' && this.stage.getChildByName('role').x <this.width && this.stage.getChildByName('role').x < this.monster1.children[0].x) {
        this.stage.getChildByName('role').x += 7
      }
      if (e.key === 'ArrowUp') {
        this.man.way = 'up'
        createjs.Tween.get(this.man)
          .to({ y: 150, scale: 0.8 }, 500, createjs.Ease.circOut)
        // this.attack.scale = 0.8
      }
      if (e.key === 'ArrowDown') {
        this.man.way = 'down'
        createjs.Tween.get(this.man)
          .to({y:175, scale:1},500,createjs.Ease.circOut)
          this.attack.y = 0 
        }
    })
  }
  resize() {
    window.addEventListener('resize', _ => {
      this.man.x = this.width / 2
      this.man.y = 100
    })
  }
  updated() {
    // createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHEN
    createjs.Ticker.setFPS(60)
    const monsterNum = document.querySelector('#monsterNum')
    // 选择难度
    monsterNum.addEventListener('change', (value) => {
        this.monster1.removeAllChildren()
        this.monster2.removeAllChildren()
        for (let index = 0; index < monsterNum.value; index++) {
          this.addMonster1()
          this.addMonster2()
      }
    })
      //定时器
    createjs.Ticker.addEventListener('tick', _ => {
      // 一号怪兽的判断
      if (this.monster1.children[0]) {
        for (let index = 0; index < this.monster1.children.length; index++) {
          const element = this.monster1.children[index];
            const m1 = Math.round(element.x) + 120  //怪兽的x位置
          const rolex = this.man.x  //人物的x位置
            if (m1 > rolex && m1 < rolex+10  && element.children[0].currentAnimation === 'walk' && this.man.children[0].currentAnimation !== 'death' && this.man.y - element.y === 65) {
              element.children[0].gotoAndPlay('attack')
            }
          this.attack.children.forEach((item, index, arr) => {
              const x = item.x //箭头的位置
              if (x >= m1 && x <= m1 + 20 && item.y - element.y === 130) {
                if (element.children[0].currentAnimation !== 'death') {
                  Number(element.hp)
                  element.hp--
                  element.children[1].text = element.hp
                  this.attack.removeChild(item)
                }
                if (element.children[0].currentAnimation !== 'death' && element.hp === 0) {
                  element.children[0].gotoAndPlay('death')
                  this.attack.removeChild(item)
                }
              }
            })
        }
      }
      // 二号怪兽的判断
      if (this.monster2.children[0]) {
        for (let index = 0; index < this.monster2.children.length; index++) {
          const element = this.monster2.children[index];
          const m2 = Math.round(element.x) + 120  //怪兽的x位置
          const rolex = this.man.x  //人物的x位置
          if (m2 > rolex && m2 < rolex+10  && element.children[0].currentAnimation === 'walk' && this.man.children[0].currentAnimation !== 'death' && this.man.y - element.y === 50) {
            element.children[0].gotoAndPlay('attack')
          }
          this.attack.children.forEach((item, index, arr) => {
            const x = item.x+100 //箭头的位置
              if (x >= m2 && x <= m2 + 20 && item.y - element.y === 90) {
                if (element.children[0].currentAnimation !== 'death') {
                  Number(element.hp)
                  element.hp--
                  element.children[1].text = element.hp
                  this.attack.removeChild(item)
                }
                if (element.children[0].currentAnimation !== 'death' && element.hp === 0) {
                  element.children[0].gotoAndPlay('death')
                  this.attack.removeChild(item)
                }
              }
            })
        }
      }
      this.stage.update()
    })
  }
  background() {
    const bg1 = new createjs.Container()
    const bg2 = new createjs.Container()
    bg1.name = 'bg1'
    bg2.name = 'bg2'
    this.stage.addChild(bg1)
    this.stage.addChild(bg2)
    createjs.Tween.get(bg1, { loop: true })
      .to({ x: -1247 }, 10000)
      .to({ x: 1247 })
      .to({ x: 0 }, 10000)
    createjs.Tween.get(bg2, { loop: true })
      .to({ x: 1247 })
      .to({ x: -1247 }, 20000)
    this.loadImg(bg1, 'bg')
    this.loadImg(bg2, 'bg')
  }
  loadImg(obj, id) {
    const load = new createjs.LoadQueue(false)
    load.loadManifest(this.allAmg)
    load.on('complete', _ => {
      const bg = load.getResult(id)
      const bitmapBg = new createjs.Bitmap(bg)
      obj.addChild(bitmapBg)
    })
  }
  Monster1() {
    this.monster1 = new createjs.Container()
    this.monster1.name = 'monster1'
    this.stage.addChild(this.monster1)
    this.addMonster1()
  }
  Monster2() {
    this.monster2 = new createjs.Container()
    this.monster2.name = 'monster2'
    this.stage.addChild(this.monster2)
    this.addMonster2()
  }
  addMonster1 () {
    const monster = new createjs.Container()
    this.monster1.addChild(monster)
    monster.x = this.width
    monster.y = 110
    const monsterSheet = new createjs.SpriteSheet({
      images: [
        "./img/monster.png"
      ],
      frames: { width: 238, height: 259,margin:20 },
      animations: {
        walk: [49, 55, 'walk', 0.2],
        attack: [32, 48, 'walk', 0.5],
        death: [0, 31, '', 0.3],
      },
    })
    const monster1 = new createjs.Sprite(monsterSheet, "walk")
    monster.hp = 3
    monster1.addEventListener('animationend', e => {
      if (e.name === 'death') {
        createjs.Tween.get(monster, { override:true })
        .to({alpha:0},1000)
        setTimeout(_ => {
          this.monster1.removeChild(monster)
          this.addMonster1()
        },1000)
      }
      if (e.name === 'attack') {
        this.man.children[0].gotoAndPlay('death')
      }
    })
    monster.addChild(monster1)
    this.monsterTween = createjs.Tween.get(monster, { loop: true })
      .wait(Math.floor(Math.random() * 10) * 100)
      .to({ x: this.width })
      .to({ x: -200 }, 10000)
    const text = new createjs.Text(monster.hp, '48px Arial', '#ff0000')
    text.x = 130
    monster.addChild(text)
  }
  addMonster2 () {
    const monster = new createjs.Container()
    this.monster2.addChild(monster)
    monster.x = this.width
    monster.y = 100
    const monsterSheet = new createjs.SpriteSheet({
      images: ['./img/monster2.png'],
      frames: { width: 183, height: 199, count: 56 },
      animations: {
        walk: [49,55,'walk',0.2],
        attack: [32,48,'walk',0.5],
        death: [0, 31, '', 0.3]
      }
    })
    const monster2 = new createjs.Sprite(monsterSheet, 'walk')
    monster.hp = 3
    monster2.addEventListener('animationend', e => {
      if (e.name === 'death') {
        createjs.Tween.get(monster, { override: true })
          .to({ alpha: 0 }, 1000)
        setTimeout(_ => {
          this.monster2.removeChild(monster)
          this.addMonster2()
        },1000)
      }
      if (e.name === 'attack') {
        this.man.children[0].gotoAndPlay('death')
      }
    })
    monster.addChild(monster2)
    createjs.Tween.get(monster, { loop: true })
      .wait(Math.floor(Math.random() * 10) * 500)
      .to({ x: this.width })
      .to({ x: -200 }, 10000)
    const text = new createjs.Text(monster.hp, '48px Arial', '#ff0000')
    text.x = 100
    monster.addChild(text)
  }
  attackSystem() {
    this.attack = new createjs.Container()
    this.attack.name = 'attack'
    this.stage.addChild(this.attack)
  }
  addArrow (y) {
    for (let i = 0; i < BULLET_COUNT; i++) {
      const arrowSheet = new createjs.SpriteSheet({
        images: ['./img/Arrow.png'],
        animations: {
          shoot: [0, 4, 2]
        },
        frames: [
          [0, 0, 75, 32], 
          [75, 0, 75, 32], 
          [150, 0, 77, 32], 
          [227, 0, 77, 32], 
          [304, 0, 78, 32]
        ]
      })
      arrowSheet.on('complete', (e) => console.log('Completer ===>', e))
      arrowSheet.on('error', (e) => console.log('Error ===>', e))
      this.arrow = new createjs.Sprite(arrowSheet, 'shoot')
      this.arrow.name = 'arrow'
      this.arrow.x = this.stage.getChildByName('role').x + INIT_ATTACK_RANGE
      this.arrow.y = y
      this.attack.addChild(this.arrow)
      this.arrow.name = `arrow${i}`
      const RANGE = this.width - (this.stage.getChildByName('role').x + INIT_ATTACK_RANGE)
      createjs.Tween.get(this.arrow)
        .wait(500)
        .to({ x: this.stage.getChildByName('role').x + INIT_ATTACK_RANGE })
        .to({ x: this.width }, RANGE/BULLET_SPEED)
        .to({ alpha: 0 })
    }
  }
}
const ctx = document.querySelector('#testCanvas')
const game = new Game(ctx)
game.init()
