import {
  query
} from "../../api/index.js"
import {
  assetsUrl
} from "../../env.js"
Page({
  data: {
    /**存放第一行图片地址*/
    lineOneImgs: [],
    /**存放第二行图片地址*/
    lineTwoImgs: [],
    /**存放第三行图片地址*/
    lineThreeImgs: [],
    /**存放第四行图片地址*/
    lineFourImgs: [],
    /**存放第五行图片地址*/
    lineFiveImgs: [],
    /**存放第六行图片地址*/
    lineSizImgs: [],
    /**存放第七行图片地址*/
    lineSevenImgs: [],
    /** 图片配置项，包括每张图片的坐标，变换位置时的偏移量与偏移动画时长，图片地址*/
    imgConfigs: [{
      /**x坐标*/
      x: "",
      /** y坐标*/
      y: "",
      /**横向偏移值 */
      moveX: "", //
      /** 纵向偏移值*/
      moveY: "",
      /** 动画时长*/
      aniDuration: 0,
      /** 图片地址*/
      url: "",
      /** 翻转状态 */
      rotateY: false,
      /** 是否晃动*/
      bellSwing: false,
    }],
    assetsUrl
  },
  /**视口在图片容器中的坐标和尺寸 */
  viewPort: {
    w: 0,
    h: 0,
    x: 0,
    y: 0
  },
  /**图片容器的宽度 */
  boxW: 0,
  /**图片容器的高度 */
  boxH: 0,
  /** 每个图片宽度*/
  photoW: 0,
  /** 每个图片高度*/
  photoH: 0,
  /** 图片地址仓库 */
  imgsHouse: [],
  /** 图片进入视口触发晃动的阈值 */
  throhold: 0.75,
  onLoad(options) {
    this.init()
  },
  onShow() {
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setSelectedByPath(this.route);
    }
  },
  /**初始化，为画廊设置默认的图片*/
  init() {
    this.updateImgConfigs(new Array(49).fill("_").map((i, index) => {
      return {
        x: 0,
        y: 0,
        moveX: 0, //横向偏移值
        moveY: 0, //纵向偏移值
        aniDuration: 1, //动画时长
        url: assetsUrl + `/photo.webp`, //图片地址
        rotateY: false, //是否翻转
        bellSwing: false, //是否晃动
      }
    }))
  },
  async onReady() {
    await this.initImgsHouse()
    this.getRelativePos()
  },
  /**获取图片*/
  async initImgsHouse() {
    const imgs = await query({
      'pageNum': 1,
      'pageSize': 100
    });
    this.imgsHouse = imgs.map(i => i.src);
  },
  /**计算图片是否在视口中从而晃动和加载图片 */
  ifInViewport(imgX,imgY,moveX,moveY){
    const curImgX = imgX+ moveX,
      curImgY = imgY + moveY,
      {x,y,w,h} = this.viewPort;
    if (curImgX + (1 - this.throhold) * this.photoW > x &&
      curImgX + this.throhold * this.photoW < x + w &&
      curImgY + (1 - this.throhold) * this.photoH &&
      curImgY + this.throhold * this.photoH < y + h) {
      return {
        url:this.imgsHouse.shift(),
        bellSwing:true,
      }
    }else{
      return {
        url:assetsUrl + `/photo.webp`,
        bellSwing:false
      }
    }
  },
  /**获取坐标等参数数据*/
  getRelativePos() {
    const {
      windowWidth,
      windowHeight
    } = wx.getWindowInfo()
    this.viewPort = {
      w: windowWidth,
      h: windowHeight
    }
    return new Promise((resolve, reject) => {
      const query = wx.createSelectorQuery()

      query.select('.photo-line-x').boundingClientRect()
      query.selectAll('.img-x').boundingClientRect()

      query.exec(res => {
        /**.photo-line-x */
        const parent = res[0]
        /**.img-x */
        const childs = res[1]
        this.boxH = parent.height;
        this.boxW = parent.width;
        this.photoW = childs[0].width;
        this.photoH = childs[0].height;
        this.viewPort = {
          ...this.viewPort,
          x: Math.abs(parent.left),
          y: Math.abs(parent.top)
        }
        this.updateImgConfigs(childs.map((i, index) => {    
          //计算每个图片元素的坐标,以.photo-line-x为坐标系，坐标原点在.photo-line-x 的左上角，x,y都为正值且越大越远离原点。
          const x=Math.abs(parent.left - i.left), //.left值是相对于视图的左上角
          y= Math.abs(parent.top - i.top); //.top同理
          const {bellSwing,url} = this.ifInViewport(x,y,0,0)
          return {
            x,y,
            moveX: 0, //横向偏移值
            moveY: 0, //纵向偏移值
            aniDuration: 1, //动画时长
            url,//图片地址
            rotateY: false, //是否翻转
            bellSwing, //是否晃动
          }
        }))
        resolve()
      })
    })
  },
  /**手指开始拖动时x坐标 */
  fingerX: 0,
  /**手指开始拖动时y坐标 */
  fingerY: 0,
  /**标记是否处于拖动状态 */
  ifMovable: false,
  onTouchStart(e) {
    const t = e.touches[0]
    this.fingerX = t.pageX
    this.fingerY = t.pageY
    this.ifMovable = true;
  },
  onTouchMove(e) {
    const t = e.touches[0]
    this.move(t.pageX, t.pageY);
  },
  onTouchEnd() {
    this.ifMovable = false
  },
  move(x, y) {
    if (!this.ifMovable) return;
    //计算拖动距离
    let distanceX = (x - this.fingerX);
    let distanceY = (y - this.fingerY);
    this.data.imgConfigs.forEach((img) => {
      img.aniDuration = 1;
      img.moveX += distanceX;
      //图片元素位置超出容器右边界，移动图片到最左边
      if (img.x + img.moveX > this.boxW) {
        img.moveX -= this.boxW;
        img.aniDuration = 0;
      }
      //图片元素位置超出容器左边界，移动图片到最右边
      if (img.x + img.moveX < -this.photoW) {
        img.moveX += this.boxW;
        img.aniDuration = 0;
      }
      img.moveY += distanceY;
      //图片元素位置超出容器下边界，移动图片到最上边
      if (img.y + img.moveY > this.boxH) {
        img.moveY -= this.boxH;
        img.aniDuration = 0;
      }
      //图片元素位置超出容器上边界，移动图片到最下边
      if (img.y + img.moveY < -this.photoH) {
        img.moveY += this.boxH;
        img.aniDuration = 0;
      }
      if(img.bellSwing===false){
        const {bellSwing,url} = this.ifInViewport(img.x,img.y,img.moveX,img.moveY)
        img.bellSwing = bellSwing;
        img.url = url
      }
    });
    this.updateImgConfigs(this.data.imgConfigs)
    this.fingerX = x;
    this.fingerY = y;
  },
  /**
   * setData图片配置项并将其分成四部分渲染到页面
   */
  updateImgConfigs(newData) {
    const imgs = newData.map(i => i.url)
    const newImgs = [imgs.slice(0, 7), imgs.slice(7, 14), imgs.slice(14, 21), imgs.slice(21, 28), imgs.slice(28, 35), imgs.slice(35, 42), imgs.slice(42, 49)]
    this.setData({
      lineOneImgs: newImgs[0],
      lineTwoImgs: newImgs[1],
      lineThreeImgs: newImgs[2],
      lineFourImgs: newImgs[3],
      lineFiveImgs: newImgs[4],
      lineSixImgs: newImgs[5],
      lineSevenImgs: newImgs[6],
      imgConfigs: newData
    })
  },

  onResize(res) {
    //  横屏模式隐藏菜单
    if (res.size.windowWidth > res.size.windowHeight) {
      wx.hideTabBar()
    } else {
      wx.showTabBar()
    }
  },
  /**每张图片加载完毕后翻转 */
  onImgLoad(e) {
    if (e.target.id) {
      const index = parseInt(e.target.id);
      this.updateImgConfigs([
        ...this.data.imgConfigs.slice(0, index),
        {
          ...this.data.imgConfigs[index],
          rotateY: true,
        },
        ...this.data.imgConfigs.slice(index + 1, this.data.imgConfigs.length)
      ])
    }
  }
})
