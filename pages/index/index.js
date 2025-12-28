import {query} from "../../api/index.js"
Page({
  data: {
    /**存放第一行图片地址*/
    lineOneImgs:[],
    /**存放第二行图片地址*/
    lineTwoImgs:[],
    /**存放第三行图片地址*/
    lineThreeImgs:[],
    /**存放第四行图片地址*/
    lineFourImgs:[],
    /**存放第五行图片地址*/
    lineFiveImgs:[],
    /**存放第六行图片地址*/
    lineSizImgs:[],
    /**存放第七行图片地址*/
    lineSevenImgs:[],
    /** 图片配置项，包括每张图片的坐标，变换位置时的偏移量与偏移动画时长，图片地址*/
    imgConfigs:[
      {
        /**x坐标*/
        x:"",
        /** y坐标*/
        y:"",
        /**横向偏移值 */
        moveX:"",//
        /** 纵向偏移值*/
        moveY:"",
        /** 动画时长*/
        aniDuration:0,
        /** 图片地址*/
        url:"",
      }
    ],
  },
  /**图片容器的宽度 */
  boxW:"",
  /**图片容器的高度 */
  boxH:"",
  /** 每个图片宽度*/
  photoW:"",
  /** 每个图片高度*/
  photoH:"",
  onLoad(options) {
    this.init()
  },
  /**初始化，为画廊设置默认的图片*/
  init(){
    this.updateImgConfigs(new Array(49).fill("_").map((i,index)=>{
      return {
        x:0,
        y:0,
        moveX:0,//横向偏移值
        moveY:0,//纵向偏移值
        aniDuration:1,//动画时长
        url:`https://fami.zhzhmaomoa.pet/photo.png`,//图片地址
      }
    })) 
  },
  async onReady() {
    await this.getRelativePos()
    this.replaceImgLazy()
  },
  /**获取坐标等参数数据*/
  getRelativePos() {
    return new Promise((resolve,reject)=>{
      const query = wx.createSelectorQuery()

      query.select('.photo-x').boundingClientRect()
      query.selectAll('.img-x').boundingClientRect()
  
      query.exec(res => {
        const parent = res[0]
        const childs = res[1]
        this.boxH = parent.height;
        this.boxW = parent.width;
        this.photoW = childs[0].width;
        this.photoH = childs[0].height;
        this.updateImgConfigs(childs.map((i,index)=>{
          return {
            //计算每个图片元素的坐标
            x:Math.abs(parent.left - i.left),//.left值是相对于视图的左上角
            y:Math.abs(parent.top - i.top),//.top同理
            moveX:0,//横向偏移值
            moveY:0,//纵向偏移值
            aniDuration:1,//动画时长
            url:`https://fami.zhzhmaomoa.pet/photo.png`,//图片地址
          }
        }))
        resolve()
      })
    })
  },
  /**将进入用户视线的图片从默认替换成远程获取的*/
  async replaceImgLazy(){
    const imgs = await query({'pageNum':1,'pageSize':100});
    const imgsHouse = imgs.map(i=>i.src);
    new Array(49).fill("_").map((i,index)=>{
      let observer = this.createIntersectionObserver({thresholds:[0.2]})
      //所有id开头为imgX的进行监听，imgX元素进入视野时触发监听，从imgsHouse中取一个远程图片替换默认图片，无论取不取到都取消监听
      observer.relativeToViewport().observe(`#imgX${index}`, (res) => {
        const nextImg = imgsHouse.shift()
        if(nextImg){
          console.log(nextImg)
          this.updateImgConfigs([
            ...this.data.imgConfigs.slice(0,index),
            {
              ...this.data.imgConfigs[index],
              url:nextImg
            },
            ...this.data.imgConfigs.slice(index+1,this.data.imgConfigs.length)
          ])
        }
        observer.disconnect()
        observer = null
      })
    })
  },
  /**手指开始拖动时x坐标 */
  fingerX: 0,
  /**手指开始拖动时y坐标 */
  fingerY: 0,
  /**标记是否处于拖动状态 */
  ifMovable:false,
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
            img.aniDuration=0;
        }
        //图片元素位置超出容器左边界，移动图片到最右边
        if (img.x + img.moveX < -this.photoW) {
            img.moveX += this.boxW;
            img.aniDuration=0;
        }
        img.moveY += distanceY;
        //图片元素位置超出容器下边界，移动图片到最上边
        if (img.y + img.moveY > this.boxH) {
            img.moveY -= this.boxH;
            img.aniDuration=0;
        }
        //图片元素位置超出容器上边界，移动图片到最下边
        if (img.y + img.moveY < -this.photoH) {
            img.moveY += this.boxH;
            img.aniDuration=0;
        }
    });
    this.updateImgConfigs(this.data.imgConfigs)
    this.fingerX = x;
    this.fingerY = y;
  },
  /**
   * setData图片配置项并将其分成四部分渲染到页面
   */
  updateImgConfigs(newData){
    const imgs = newData.map(i=>i.url)
    const newImgs = [imgs.slice(0,7),imgs.slice(7,14),imgs.slice(14,21),imgs.slice(21,28),imgs.slice(28,35),imgs.slice(35,42),imgs.slice(42,49)]
    this.setData({
      lineOneImgs:newImgs[0],
      lineTwoImgs:newImgs[1],
      lineThreeImgs:newImgs[2],
      lineFourImgs:newImgs[3],
      lineFiveImgs:newImgs[4],
      lineSixImgs:newImgs[5],
      lineSevenImgs:newImgs[6],
      imgConfigs:newData
    })
  },
  
  onResize(res) {
    //  横屏模式隐藏菜单
    if(res.size.windowWidth>res.size.windowHeight){
      wx.hideTabBar()
    }else{
      wx.showTabBar()
    }
  }
})