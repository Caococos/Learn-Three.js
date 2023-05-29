const app = new Vue({
  el: '#main',
  data() {
    return {
      opt: {
        container: 'panoramaConianer', //容器
        url: './img/p4.png',
        showGrid: true,
        lables: [
          { position: { lon: -147, lat: 37.2 }, logoUrl: './img/电眼.png', text: '1', size: { w: 100, h: 100 } },
          { position: { lon: -179, lat: -13.4 }, logoUrl: './img/惊讶.png', text: '2', size: { w: 32, h: 32 } },
          { position: { lon: 124.2, lat: -3 }, logoUrl: './img/哭闹.png', text: '3', size: { w: 32, h: 32 } },
          { position: { lon: 160, lat: 10.2 }, logoUrl: './img/亲亲.png', text: '4', size: { w: 32, h: 32 } }
        ],
        widthSegments: 60, //水平切段数
        heightSegments: 40, //垂直切段数（值小粗糙速度快，值大精细速度慢）
        pRadius: 1000, //全景球的半径，推荐使用默认值
        minFocalLength: 6, //镜头最a小拉近距离
        maxFocalLength: 100, //镜头最大拉近距离
        sprite: 'icon', // label,icon
        onClick: this.onClick
      },
      tabList: [
        { name: '樱花', index: '0' },
        { name: '山雾', index: '1' },
        { name: '海景1', index: '2' },
        { name: '海景2', index: '3' },
        { name: '展示页面1', index: '4' }
      ],
      tabIndex: '0',
      isShowTransition: false,
      pageIndex: 0
    }
  },
  methods: {
    // 导航栏跳转
    tabClick(strIndex) {
      this.isShowTransition = true
      toggler.checked = false
      this.tabIndex = strIndex
      this.pageChangeSwitch(strIndex)
      requestAnimationFrame((_) => {
        this.isShowTransition = false
      })
    },
    onClick(name) {
      this.isShowTransition = true
      const _name = name.object.name
      this.tabIndex = _name
      this.pageChangeSwitch(_name)
      requestAnimationFrame((_) => {
        this.isShowTransition = false
      })
    },
    prvClick() {
      let index = Number(this.tabIndex) - 1
      index = index < 0 ? 3 : index
      this.tabClick(String(index))
    },
    nextClick() {
      let index = Number(this.tabIndex) + 1
      index = index > 3 ? 0 : index
      this.tabClick(String(index))
    },
    pageChangeSwitch(index) {
      this.pageIndex = 0
      switch (index) {
        case '1':
          this.opt.url = './img/p1.png'
          this.opt.lables = [
            { position: { lon: 33, lat: -37.2 }, logoUrl: 'img/亲亲.png', text: '0', size: { w: 32, h: 32 } }
          ]
          tp.reRender(this.opt)
          break
        case '2':
          this.opt.url = './img/p2.png'
          this.opt.lables = [
            { position: { lon: 1, lat: 13.4 }, logoUrl: 'img/亲亲.png', text: '0', size: { w: 32, h: 32 } }
          ]
          tp.reRender(this.opt)
          break
        case '3':
          this.opt.url = './img/p3.png'
          this.opt.lables = [
            { position: { lon: -55.8, lat: 3 }, logoUrl: 'img/亲亲.png', text: '0', size: { w: 32, h: 32 } }
          ]
          tp.reRender(this.opt)
          break
        case '4':
          console.log('页面跳转哦')
          this.pageIndex = 1
          break
        case '0':
          this.opt.url = './img/p4.png'
          this.opt.lables = [
            { position: { lon: -147, lat: 37.2 }, logoUrl: './img/电眼.png', text: '1', size: { w: 100, h: 100 } },
            { position: { lon: -179, lat: -13.4 }, logoUrl: './img/惊讶.png', text: '2', size: { w: 32, h: 32 } },
            { position: { lon: 124.2, lat: -3 }, logoUrl: './img/哭闹.png', text: '3', size: { w: 32, h: 32 } },
            { position: { lon: 160, lat: 10.2 }, logoUrl: './img/亲亲.png', text: '4', size: { w: 32, h: 32 } }
          ]
          tp.reRender(this.opt)
          break
      }
    }
  },
  mounted() {
    tp = new tpanorama(this.opt)
  }
})

const toggler = document.querySelector('#toggler')

window.onload = function () {
  window.document.body.style = ''
}
