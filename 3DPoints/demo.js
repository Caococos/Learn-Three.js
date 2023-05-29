class ThreeDemo {
  constructor(cvs) {
    this.container = cvs || document.body
    this.mouseX = 0
    this.mouseY = 0
    // 是否开始变换
    this.flag = false
    this.glist = []
    // 点阵模型索引
    this.objIndex = -1

    // 场景
    this.createScene()
    this.createLights()
    this.initGeometry()
    this.initTexture()
    this.initPartices()
    this.loadObject()
    this.initEvent()
    this.animate()
  }
  createScene() {
    this.Height = window.innerHeight
    this.Width = window.innerWidth

    this.scene = new THREE.Scene()
    // this.scene.fog = new THREE.Fog(0x090918, 1, 1000)

    this.isRotate = false //是否允许旋转

    let aspectRatio = this.Width / this.Height
    let fieldOfView = 105
    let nearPlane = 10
    let farPlane = 10000
    this.camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane)
    // this.camera = new THREE.OrthographicCamera(-600, 600, -600, 600, 1, 10000)
    this.camera.position.x = 0
    this.camera.position.y = 0
    this.camera.position.z = 500

    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(this.Width, this.Height)
    // this.renderer.setClearColor(this.scene.fog.color)
    this.container.appendChild(this.renderer.domElement)
    window.addEventListener('resize', this.handleWindowResize.bind(this), false)
  }
  handleWindowResize() {
    this.Width = window.innerWidth
    this.Height = window.innerHeight
    this.renderer.setSize(this.Width, this.Height)
    this.camera.aspect = this.Width / this.Height //更新相机的纵横比
    this.camera.updateProjectionMatrix() //更新相机视野
  }
  createLights() {
    // 户外光源
    // 第一个参数是天空的颜色，第二个参数是地上的颜色，第三个参数是光源的强度
    this.hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9)

    // 环境光源
    this.ambientLight = new THREE.AmbientLight(0xdc8874, 0.2)

    // 方向光是从一个特定的方向的照射
    // 类似太阳，即所有光源是平行的
    // 第一个参数是关系颜色，第二个参数是光源强度
    this.shadowLight = new THREE.DirectionalLight(0xffffff, 0.9)

    // 设置光源的方向。
    this.shadowLight.position.set(50, 50, 50)

    // 开启光源投影
    this.shadowLight.castShadow = true

    // 定义可见域的投射阴影
    this.shadowLight.shadow.camera.left = -400
    this.shadowLight.shadow.camera.right = 400
    this.shadowLight.shadow.camera.top = 400
    this.shadowLight.shadow.camera.bottom = -400
    this.shadowLight.shadow.camera.near = 1
    this.shadowLight.shadow.camera.far = 1000

    // 定义阴影的分辨率；虽然分辨率越高越好，但是需要付出更加昂贵的代价维持高性能的表现。
    this.shadowLight.shadow.mapSize.width = 2048
    this.shadowLight.shadow.mapSize.height = 2048

    // 为了使这些光源呈现效果，只需要将它们添加到场景中
    this.scene.add(this.hemisphereLight)
    this.scene.add(this.shadowLight)
    this.scene.add(this.ambientLight)
  }
  initGeometry() {
    this.geometry = new THREE.Geometry()
    this.around = new THREE.Geometry()
  }
  // 初始化贴图
  initTexture() {
    let textureLoader = new THREE.TextureLoader()
    textureLoader.crossOrigin = ''
    this.mapDot = textureLoader.load('img/gradient.png')
  }
  //初始化粒子体系
  initPartices() {
    //初始变换点组
    for (let i = 0; i < 10000; i++) {
      var vertex = new THREE.Vector3()
      vertex.x = 800 * Math.random() - 400
      vertex.y = 800 * Math.random() - 400
      vertex.z = 800 * Math.random() - 400

      this.geometry.vertices.push(vertex)

      this.geometry.colors.push(new THREE.Color(1, 1, 1))
    }

    /* 载体粒子体系的粒子数量要比所有模型的顶点数量的最大值还要大，这样才能保证切换到每一个模型，都不会出现缺失的情况，
    而多余的点呢就让他们从头开始重叠 */

    const material = new THREE.PointsMaterial({
      size: 4,
      sizeAttenuation: true,
      color: 0xffffff,
      transparent: true,
      opacity: 1,
      map: this.mapDot
    })
    // 传递给shader共享的的属性值
    let uniforms = {
      // 顶点颜色
      color: {
        type: 'v3',
        value: new THREE.Color(0xffffff)
      },
      // 传递顶点贴图
      texture: {
        value: this.getTexture(64)
      },
      // 传递val值，用于shader计算顶点位置
      val: {
        value: 1.0
      }
    }
    // const material = new THREE.ShaderMaterial({
    //   uniforms: uniforms,
    //   vertexShader: document.getElementById('vertexshader').textContent,
    //   fragmentShader: document.getElementById('fragmentshader').textContent,
    //   blending: THREE.AdditiveBlending,
    //   depthTest: false,
    //   transparent: true
    // })

    // material.vertexColors = THREE.VertexColors
    this.particles = new THREE.Points(this.geometry, material)
    this.scene.add(this.particles)
    this.particles.scale.set(1, 1, 1)

    //环境点组
    for (let i = 0; i < 500; i++) {
      var vertex = new THREE.Vector3()
      vertex.x = 2000 * Math.random() - 1000
      vertex.y = 2000 * Math.random() - 1000
      vertex.z = 2000 * Math.random() - 1000

      this.around.vertices.push(vertex)

      this.around.colors.push(new THREE.Color(1, 1, 1))
    }
    const aroundMaterial = new THREE.PointsMaterial({
      size: 2,
      sizeAttenuation: true,
      color: 0xffffff,
      transparent: true,
      opacity: 1,
      map: this.mapDot
    })

    aroundMaterial.vertexColors = THREE.VertexColors
    const aroundPoints = new THREE.Points(this.around, aroundMaterial)
    this.scene.add(aroundPoints)
  }
  getTexture(canvasSize = 64) {
    let canvas = document.createElement('canvas')
    canvas.width = canvasSize
    canvas.height = canvasSize
    canvas.style.background = 'transparent'
    let context = canvas.getContext('2d')
    let gradient = context.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 8,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2
    )
    gradient.addColorStop(0, '#fff')
    gradient.addColorStop(1, 'transparent')
    context.fillStyle = gradient
    context.beginPath()
    context.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2, true)
    context.fill()
    let texture = new THREE.Texture(canvas)
    texture.needsUpdate = true
    return texture
  }
  // 加载模型
  loadObject() {
    const that = this
    var loader = new THREE.JSONLoader()
    loader.load('obj/cpgame3.json', function (geo, materials) {
      var colors = []
      for (var i = 0; i < geo.vertices.length; i++) {
        colors.push(new THREE.Color('rgb(255, 255, 255)'))
      }

      geo.colors = colors

      //调整geometry在场景中的位置和大小

      geo.center()
      geo.normalize()
      geo.scale(500, 500, 500)
      geo.rotateX(Math.PI / 4)
      geo.rotateY(-Math.PI / 8)
      that.glist.push(geo)
    })
    loader.load('obj/cpac5.json', function (geo, materials) {
      var colors = []
      for (var i = 0; i < geo.vertices.length; i++) {
        colors.push(new THREE.Color(1, 1, 1))
      }

      geo.colors = colors
      geo.center()
      geo.normalize()

      geo.scale(600, 600, 600)
      that.glist.push(geo)
    })
    loader.load('obj/cpbook2.json', function (geo, materials) {
      var colors = []
      for (var i = 0; i < geo.vertices.length; i++) {
        colors.push(new THREE.Color(1, 1, 1))
      }

      geo.colors = colors
      geo.center()
      geo.normalize()

      geo.scale(600, 600, 600)
      that.glist.push(geo)
    })
    loader.load('obj/cpmovie4.json', function (geo, materials) {
      var colors = []
      for (var i = 0; i < geo.vertices.length; i++) {
        colors.push(new THREE.Color(1, 1, 1))
      }

      geo.colors = colors
      geo.center()
      geo.normalize()

      geo.scale(800, 800, 800)
      geo.rotateX(Math.PI / 2)
      that.glist.push(geo)
    })
    loader.load('obj/cpvk3.json', function (geo, materials) {
      geo.center()
      geo.normalize()

      geo.scale(800, 800, 800)
      geo.translate(0, -300, 0)
      that.glist.push(geo)
    })
  }
  // 事件监听
  initEvent() {
    document.addEventListener('mousedown', this.onDocumentMouseDown.bind(this), false)
    document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false)
    document.addEventListener('mouseup', this.onDocumentMouseUp.bind(this), false)
    document.addEventListener('mouseout', this.onDocumentMouseOut.bind(this), false)
    document.addEventListener('mousewheel', this.onDocumentMouseWheel.bind(this), false)
    // document.addEventListener('keydown', this.onDocumentKeyDown.bind(this), false)
    // window.addEventListener('resize', this.onWindowResize, false)
    this.moveFunc = this.throttle(this.tweenMouseMove, 100)
    this.wheelFunc = this.throttle(this.tweenMouseWheel, 2000)
    setTimeout(() => {
      this.flag = true
      this.objIndex++
      this.tweenObj(this.objIndex)
    }, 1500)
  }
  onDocumentMouseMove(event) {
    // if (this.isRotate) {
    //   //Math.PI圆周率
    //   this.particles.rotateY(((event.pageX - this.mouseX) / 1000) * 2 * Math.PI)
    //   this.particles.rotateX(((event.pageY - this.mouseY) / 500) * 2 * Math.PI)
    //   event.preventDefault()
    //   this.mouseX = event.pageX
    //   this.mouseY = event.pageY
    // } else {
    this.moveFunc((event.pageX - this.mouseX) / 100)
    // this.particles.rotateY((event.pageX - this.mouseX) / 5000)
    this.mouseX = event.pageX
    // this.mouseY = event.pageY
    // }
  }
  onDocumentMouseDown(event) {
    event.preventDefault()
    // 监听鼠标移动函数保存 -- 方便移除监听
    // this.mouseMoveFunc = this.onDocumentMouseMove.bind(this)
    // this.isRotate = true

    this.mouseX = event.pageX
    this.mouseY = event.pageY
  }
  onDocumentMouseUp(event) {
    //释放鼠标键
    this.isRotate = false
    // document.removeEventListener('mousemove', this.mouseMoveFunc, false)
    // document.removeEventListener('mouseup', this.onDocumentMouseUp.bind(this), false)
    // document.removeEventListener('mouseout', this.onDocumentMouseOut.bind(this), false)
  }
  onDocumentMouseOut(event) {
    //移走鼠标
    this.isRotate = false
  }
  onDocumentMouseWheel() {
    // this.camera.position.z += event.deltaY / 2
    this.wheelFunc(event.deltaY)
  }
  onDocumentKeyDown(event) {
    if (event.which == 40 && this.objIndex < 4) {
      this.objIndex++
      this.tweenObj(this.objIndex)
      this.flag = true
    } else if (event.which == 38 && this.objIndex > 0) {
      this.objIndex--
      this.tweenObj(this.objIndex)
      this.flag = true
    }
  }
  onWindowResize() {
    this.windowHalfX = window.innerWidth / 2
    this.windowHalfY = window.innerHeight / 2

    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
  tweenObj(index) {
    const that = this
    if (index === 0 || index === 2 || index === 4) {
      console.log('1', index)
      new TWEEN.Tween(this.particles.position)
        .to(
          {
            x: -300,
            y: 0,
            z: 0
          },
          1000
        )
        .delay(350)
        .easing(TWEEN.Easing.Cubic.In)
        .start()
    } else if (index === 1 || index === 3) {
      console.log('2', index)
      new TWEEN.Tween(this.particles.position)
        .to(
          {
            x: 300,
            y: 0,
            z: 0
          },
          1000
        )
        .easing(TWEEN.Easing.Cubic.In)
        .delay(350)
        .start()
    }
    this.geometry.vertices.forEach(function (e, i, arr) {
      var length = that.glist[index].vertices.length
      var o = that.glist[index].vertices[i % length]
      new TWEEN.Tween(e)
        .to(
          {
            x: o.x,
            y: o.y,
            z: o.z
          },
          750
        )
        .easing(TWEEN.Easing.Cubic.In)
        .delay(1000 * Math.random())
        .start()
        .onComplete(() => {
          // todo
        })
    })
    // this.camera.lookAt(this.scene.position)
    // this.flag = false
    // this.camera.position.z = 750
  }
  animate(time) {
    requestAnimationFrame(() => {
      this.animate()
    })
    this.render()
    // stats.update()
  }
  render() {
    //初始粒子体系绕Y轴匀速转动
    if (!this.flag) {
      this.geometry.rotateY(Math.PI / 200)
    }
    //环境粒子转动
    this.around.rotateX(Math.PI / 1000)
    //tween 实时更新粒子位置
    TWEEN.update()
    // 指定相机角度
    this.camera.lookAt(this.scene.position)
    // 随机变换顶点颜色
    this.geometry.colors.forEach(function (color) {
      color.setRGB(Math.random() * 1, Math.random() * 1, Math.random() * 1)
    })
    // 设置几何体的顶点和颜色可以被更新
    this.geometry.verticesNeedUpdate = true
    this.geometry.colorsNeedUpdate = true
    // 渲染器渲染
    this.renderer.render(this.scene, this.camera)
  }
  // 防抖
  throttle(fn, delay = 1000) {
    let timer
    return function () {
      if (!timer) {
        fn.apply(this, arguments)
        timer = setTimeout(() => {
          clearTimeout(timer)
          timer = null
        }, delay)
      }
    }
  }
  // 节流
  debounce(fn, delay = 500) {
    let timer = null
    return function () {
      const context = this
      let args = arguments

      clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(context, args)
      }, delay)
    }
  }
  tweenMouseMove(now = 0.1) {
    now = now >= 0.5 ? 0.5 : now
    now = now <= -0.5 ? -0.5 : now
    new TWEEN.Tween(this.particles.rotation)
      .to(
        {
          x: 0,
          y: this.particles.rotation.y + now,
          z: 0
        },
        500
      )
      .easing(TWEEN.Easing.Linear.None)
      .start()
  }
  tweenMouseWheel(index) {
    if (index > 0 && this.objIndex < 4) {
      this.objIndex++
      this.tweenObj(this.objIndex)
    } else if (index < 0 && this.objIndex > 0) {
      this.objIndex--
      this.tweenObj(this.objIndex)
    }
  }
}
;(function onLoad() {
  new ThreeDemo(document.getElementById('world'))
})()
