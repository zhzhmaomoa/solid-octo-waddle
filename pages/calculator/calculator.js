Page({
  data: {
    diamondFuture:0,
    diamondRainActive:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.diamondMap = {
      daily:50,
      ruby:90,
      duer:()=>{return Math.floor(Math.random()*16) + 15},
      duerWeekSettlement:()=>{return Math.random()<0.5?28:38},
      gachaMachine:100,
      party:50,
      continuousLoginWeekend:120,
      family:50,
      loginEveryWeek:20
    };
  },
  compute(e){
    console.log(e)
    let diamondFuture = 0;
    const {value:formData} = e.detail;
    const {diamondCurrent,diamondFood,diamondShared,duration,itemsEveryDay,itemsEveryWeek,order} = formData;
    diamondFuture = Number(diamondCurrent) + (diamondFood + diamondShared + order) * Number(duration) * 7;
    console.log(diamondFuture)
    diamondFuture += itemsEveryDay.map((item)=>{return this.diamondMap[item] * Number(duration) * 7 })
      .reduce((prev,curr)=>{return prev+curr},0)
    console.log(diamondFuture)
    diamondFuture += itemsEveryWeek.map((item)=>{return this.diamondMap[item] * Number(duration) })
    .reduce((prev,curr)=>{return prev+curr},0)
    console.log(diamondFuture)
    this.setData({diamondFuture})
  },
  switchDiamondRainActive(){
    this.setData({diamondRainActive:!this.data.diamondRainActive})
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