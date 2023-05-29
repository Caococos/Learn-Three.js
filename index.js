class ThreeDWorld {
  constructor(canvasContainer) {
    // canvas容器
    this.container = canvasContainer || document.body
    // 创建场景
    this.createScene()
    // 创建灯光
    this.createLights()
    // 性能监控插件
    this.initStats()
    // 物体添加
    this.addObjs()
    // 轨道控制插件（鼠标拖拽视角、缩放等）
    // this.orbitControls = new THREE.OrbitControls(this.camera)
    // this.orbitControls.autoRotate = true
    // 循环更新渲染场景
    this.update()
  }
  // 场景
  createScene() {
    this.HEIGHT = window.innerHeight;
    this.WIDTH = window.innerWidth;
    // 创建场景
    this.scene = new THREE.Scene();
    // 在场景中添加雾的效果，参数分别代表‘雾的颜色’、‘开始雾化的视线距离’、刚好雾化至看不见的视线距离’
    this.scene.fog = new THREE.Fog(0x090918, 1, 600);
    // 创建相机
    let aspectRatio = this.WIDTH / this.HEIGHT;
    let fieldOfView = 60;
    let nearPlane = 1;
    let farPlane = 10000;
    /**
     * PerspectiveCamera 透视相机
     * @param fieldOfView 视角
     * @param aspectRatio 纵横比
     * @param nearPlane 近平面
     * @param farPlane 远平面
     */
    this.camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );
  
    // 设置相机的位置
    this.camera.position.x = 0;
    this.camera.position.z = 150;
    this.camera.position.y = 0;
    // 创建渲染器
    this.renderer = new THREE.WebGLRenderer({
        // 在 css 中设置背景色透明显示渐变色
        alpha: true,
        // 开启抗锯齿
        antialias: true
    });
    // 渲染背景颜色同雾化的颜色
    this.renderer.setClearColor(this.scene.fog.color);
    // 定义渲染器的尺寸；在这里它会填满整个屏幕
    this.renderer.setSize(this.WIDTH, this.HEIGHT);
  
    // 打开渲染器的阴影地图
    this.renderer.shadowMap.enabled = true;
    // this.renderer.shadowMapSoft = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    // 在 HTML 创建的容器中添加渲染器的 DOM 元素
    this.container.appendChild(this.renderer.domElement);
    // 监听屏幕，缩放屏幕更新相机和渲染器的尺寸
    window.addEventListener('resize', this.handleWindowResize.bind(this), false);
  }

    // 更新渲染器的高度和宽度以及相机的纵横比
  handleWindowResize() {
    this.HEIGHT = window.innerHeight;
    this.WIDTH = window.innerWidth;
    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.camera.aspect = this.WIDTH / this.HEIGHT;
    this.camera.updateProjectionMatrix();
  }
  // 光源
  createLights() {
    // 户外光源
    // 第一个参数是天空的颜色，第二个参数是地上的颜色，第三个参数是光源的强度
    this.hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9);

    // 环境光源
    this.ambientLight = new THREE.AmbientLight(0xdc8874, .2);

    // 方向光是从一个特定的方向的照射
    // 类似太阳，即所有光源是平行的
    // 第一个参数是关系颜色，第二个参数是光源强度
    this.shadowLight = new THREE.DirectionalLight(0xffffff, .9);

    // 设置光源的位置方向
    this.shadowLight.position.set(50, 50, 50);

    // 开启光源投影
    this.shadowLight.castShadow = true;

    // 定义可见域的投射阴影
    this.shadowLight.shadow.camera.left = -400;
    this.shadowLight.shadow.camera.right = 400;
    this.shadowLight.shadow.camera.top = 400;
    this.shadowLight.shadow.camera.bottom = -400;
    this.shadowLight.shadow.camera.near = 1;
    this.shadowLight.shadow.camera.far = 1000;

    // 定义阴影的分辨率；虽然分辨率越高越好，但是需要付出更加昂贵的代价维持高性能的表现。
    this.shadowLight.shadow.mapSize.width = 2048;
    this.shadowLight.shadow.mapSize.height = 2048;

    // 为了使这些光源呈现效果，需要将它们添加到场景中
    this.scene.add(this.hemisphereLight);
    this.scene.add(this.shadowLight);
    this.scene.add(this.ambientLight);
  }
  
// 物体添加
  addObjs(){
  // 使用基础网孔材料
  // let mat = new THREE.MeshBasicMaterial({
  //     color: 0xff0000,
  //     // 绘制为线框
  //     wireframe: true
  // });
  // // 创建立方体几何模型
  // let cube1 = new THREE.BoxGeometry(10, 20, 30, 1, 1, 1);
  // // 混合模型与材质
  // let m_cube1 = new THREE.Mesh(cube1, mat);
  // let cube2 = new THREE.BoxGeometry(10, 20, 30, 2, 2, 2);
  // let m_cube2 = new THREE.Mesh(cube2, mat);
  // let cube3 = new THREE.BoxGeometry(10, 20, 30, 3, 3, 3);
  // let m_cube3 = new THREE.Mesh(cube3, mat);
  // m_cube1.position.x = -30;
  // m_cube2.position.x = 0;
  // m_cube3.position.x = 30;
  // this.scene.add(m_cube1);
  // this.scene.add(m_cube2);
  // this.scene.add(m_cube3);
  
  let _textXY = this.getTextInfo('1');
	
  let pointGeometry = new THREE.BufferGeometry();
  let amount = 1000;
  let positionData = new Float32Array( amount * 3 );
  let randomData = new Float32Array( amount * 3);
  let textXY, x, y, a, i, j, offset;

  for (j = 0; j < amount; j++) {
    textXY = _textXY.xyas;
    offset = j * 3;
    x = textXY[j * 3 + 0];
    y = textXY[j * 3 + 1];
    a = textXY[j * 3 + 2];
    
    let radius = 30 + Math.floor(j / 360.0) / 200;
    positionData[offset + 0] = x - _textXY.width / 2;
    positionData[offset + 1] =  -(y - 32);
    positionData[offset + 2] = 0;
    
    randomData[offset] = Math.random();
  }

    pointGeometry.addAttribute( 'a_random', new THREE.BufferAttribute( randomData, 1 ) ); //用于动画
    pointGeometry.addAttribute('position', new THREE.BufferAttribute(positionData, 3)); // particles位置
    let pMaterial = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      // size: 20,
      blending: THREE.AdditiveBlending,
      transparent: true
  });
    let points = new THREE.Points(pointGeometry, pMaterial);  

    let centerArr = {}
    this.scene.add(points); // 添加至场景
    var particlesAttr = points.geometry.attributes;
    TweenLite.to(particlesAttr.position.array, 1, centerArr);
    centerArr.onUpdate = function () {
        particlesAttr.position.needsUpdate = true;
    };
    centerArr.onComplete = function () {
        TweenLite.to(particlesAttr.position.array, 2, arr1);
        arr1.onUpdate = function () {
            particlesAttr.position.needsUpdate = true;
        };
    };
  }

  startEvent1 () {
    var particlesAttr = points.geometry.attributes;
    TweenLite.to(particlesAttr.position.array, 1, centerArr);
    centerArr.onUpdate = function () {
        particlesAttr.position.needsUpdate = true;
    };
    centerArr.onComplete = function () {
        TweenLite.to(particlesAttr.position.array, 2, arr1);
        arr1.onUpdate = function () {
            particlesAttr.position.needsUpdate = true;
        };
    };
}

  // 性能监控
  initStats() {
    this.stats = new Stats();
    // 将性能监控屏区显示在左上角
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.bottom = '0px';
    this.stats.domElement.style.zIndex = 100;
    this.container.appendChild(this.stats.domElement);
  }

  // 循环更新渲染
  update() {
  // 动画插件
  // TWEEN.update();
  // 性能监测插件
  this.stats.update();
  // 渲染器执行渲染
  this.renderer.render(this.scene, this.camera);
  // 循环调用
  requestAnimationFrame(() => {
      this.update()
  });
  }
  getTextInfo (text) {
    var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      ctx.font = '32px adobe-text-pro';
      var width = canvas.width = Math.ceil(ctx.measureText(text).width);
      canvas.height = 32;
      ctx.font = '32px adobe-text-pro';
      // 将文字绘制到canvas上
      ctx.fillText(text, 0, 32 * 3 / 4);
      
      var x, y;
      var data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      var xyas = [];
      for(var i = 0, len = data.length / 4; i < len; i++) {
          if(data[i * 4 + 3] > 0) {
              xyas.push(
                  i % width,     // x位置
                  i / width | 0, // y位置
                  data[i * 4 + 3] / 255 // alpha (glsl是0-1 所以／255)
              );
          }
      }
    return {
      width: width,  // 文字宽度
      amount: xyas.length / 3, // particles数量
      xyas: xyas // 位置数据
    }
  }

  saveTextInfo () {
    var arr = [];
  }


}

let three = new ThreeDWorld()


