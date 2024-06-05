import {query} from "../../api/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgs:[],
    imgsWidth:[]
  },
  windowHeight:0,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.handleQuery()
  },
  async handleQuery(){
    try {
      const imgs = await query({'pageNum':1,'pageSize':100})
      this.setData({
        imgs
      })
      this.windowHeight = wx.getWindowInfo().windowHeight
    } catch (error) {
      console.error(error)
    }
  },
  handleImgLoaded(e){
    const {width,height} = e.detail;
    const {index}  = e.target.dataset;
    const radio = width/height;
    const actualWidth = radio * (this.windowHeight-50)/4;//50指行间距加padding
    this.data.imgsWidth[index] = Math.floor(actualWidth/2);
    if(this.data.imgsWidth.length===this.data.imgs.length){
      this.setData({
        imgsWidth:this.data.imgsWidth
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})