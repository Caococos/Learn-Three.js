const container = document.querySelector('#world')

class flatParticle {
  constructor(cvs) {
    this.container = cvs || document.body
    this.glist = []

    this.Height = window.innerHeight
    this.Width = window.innerWidth
    this.mouseX = 0
    this.mouseY = 0

    this.createScene()
    this.initCerame()
    this.initTexture()
    this.loadObject()
    this.initGeometry()
    this.initMaterial()
    this.animate()
    document.addEventListener('mousemove', this.onMouseEvent.bind(this), false)
  }
  createScene() {
    // 场景
    this.scene = new THREE.Scene()
    // 渲染器
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(this.Width, this.Height)
    const canvas = this.renderer.domElement
    this.container.appendChild(canvas)
    document.addEventListener('resize', this.handleWindowResize.bind(this), false)
  }
  initCerame() {
    let aspectRatio = this.Width / this.Height
    let fieldOfView = 105
    let nearPlane = 10
    let farPlane = 1000
    this.camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane)
    this.camera.position.set(0, 0, 500)
    const oribitControls = new THREE.OrbitControls(this.camera)
    oribitControls.target.set(0, 0, 0)
    oribitControls.update()
  }
  handleWindowResize() {
    this.Width = window.innerWidth
    this.Height = window.innerHeight
    this.renderer.setSize(this.Width, this.Height)
    this.camera.aspect = this.Width / this.Height //更新相机的纵横比
    this.camera.updateProjectionMatrix() //更新相机视野
  }
  initGeometry() {
    this.geometry = new THREE.BoxGeometry()
    console.log('uv', this.geometry)
    this.geometry.verticesNeedUpdate = true
    this.geometry.colorsNeedUpdate = true
    // this.geo.vertices.forEach((e, i, arr) => {
    //   this.geometry.vertices.push(e)
    // })
  }
  initTexture() {
    let textureLoader = new THREE.TextureLoader()
    textureLoader.crossOrigin = ''
    this.mapDot = textureLoader.load('./img/gradient.png')
  }
  loadObject() {
    const loader = new THREE.JSONLoader()
    loader.load(
      'obj/cpgame3.json',
      (geo, mate) => {
        console.log(mate)
        const colors = []
        for (var i = 0; i < geo.vertices.length; i++) {
          colors.push(new THREE.Color('rgb(255, 255, 255)'))
        }
        geo.colors = colors
        // 调整几何体在场景中的位置和大小
        geo.center()
        geo.normalize()
        geo.scale(500, 500, 500)
        // 模型顶点坐标传给几何体
        this.geometry.vertices = geo.vertices
        geo.rotateX(Math.PI / 2)
        // geo.rotateY(-Math.PI / 8)
      },
      // 加载进度回调函数
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        if (xhr.loaded / xhr.total === 1) this.initMesh()
      }
    )
  }
  initMaterial() {
    this.material = new THREE.PointsMaterial({
      size: 4,
      sizeAttenuation: true,
      color: 0xffffff,
      transparent: true,
      opacity: 1,
      map: this.mapDot
    })
  }
  initMesh() {
    this.particles = new THREE.Points(this.geometry, this.material)
    this.scene.add(this.particles)
    this.particles.scale.set(0.5, 0.5, 0.5)
  }
  animate() {
    requestAnimationFrame(() => {
      this.animate()
    })
    this.render()
  }
  render() {
    this.camera.lookAt(this.scene.position)
    this.renderer.render(this.scene, this.camera)
  }
  onMouseEvent(e) {
    this.mouseX = e.pageX
    this.mouseY = e.pageY
    console.log(this.mouseX, this.mouseY)
    this.TweenParticles()
  }
  TweenParticles() {
    if (this.mouseX !== 0 && this.mouseY !== 0) {
      console.log('zzz?')
      this.geometry.vertices.forEach((e, i, arr) => {
        new TWEEN.Tween(e)
          .to(
            {
              x: this.mouseX,
              y: this.mouseY,
              z: 0
            },
            350
          )
          .easing(TWEEN.Easing.Cubic.In)
          .delay(1000 * Math.random())
          .start()
          .onComplete(() => {
            // todo
          })
      })
    }
  }
}
;(function () {
  new flatParticle(container)
})()
