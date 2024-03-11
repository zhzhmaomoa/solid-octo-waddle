// pages/redemptionCode/redemptionCode.js
import {query} from "../../api/redemptionCode.js"
import {baseUrl} from "../../env.js"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    codes:[],
    codesVisitedList:[],
    baseUrl
  },
  pageSize:8,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.handleQuery()
    this.setData({
      codesVisitedList: wx.getStorageSync('redemptionCodeVisited')||new Array(this.pageSize).fill(false)
    })
  },
  async handleQuery(){
    try {
      const codes = await query({'pageNum':1,'pageSize':this.pageSize})
      this.countdown(codes);
    } catch (error) {
      console.error(error)
    }
  },
  timer:null,
  countdown(codes){
    const date2 = new Date();
    for(let i = 0; i < codes.length; i++){
      const deadline = new Date(codes[i].deadline);
      let timeInterval = parseInt((deadline-date2)/1000);
      const seconds = timeInterval%60;
      timeInterval = parseInt(timeInterval/60);
      const minutes = timeInterval%60;
      timeInterval =  parseInt(timeInterval/60);
      const hours = timeInterval;
      const dateArr = [hours>0?hours:0,minutes>0?minutes:0,seconds>0?seconds:0];
      const result = dateArr.reduce((pv,cv)=>{return pv+cv},0);
      if(result<=0){
        codes[i].deadlineActive = false
      }else{
        codes[i].deadlineActive = true;
      }
      codes[i].deadline  = dateArr;
    }
    this.timer = setInterval(()=>{
      for(let i = 0; i < codes.length; i++){
        if(codes[i].deadlineActive){
          const result = codes[i].deadline.reduce((pv,cv)=>{return pv+cv},0);
          if(result <= 0){
            codes[i].deadlineActive = false;
            continue;
          }
        }else{
          continue;
        }
        codes[i].deadline[2]--;
        if(codes[i].deadline[2]<0){
          codes[i].deadline[1]--;
          codes[i].deadline[2] = 59;
          if(codes[i].deadline[1]<0){
            codes[i].deadline[0]--;
            codes[i].deadline[1] = 59;
            if(codes[i].deadline[0]<=0){
              codes[i].deadline = [0,0,0]
              continue;
            }
          }
        }
      }
      this.setData({
        codes
      })
    },1000)
  },
  handleCopy(e){
    const {redemptionCode,index} =  e.currentTarget.dataset
    wx.setClipboardData({
      data:redemptionCode
    })
    this.data.codesVisitedList.splice(index,1,true);
    this.setData({
      codesVisitedList:this.data.codesVisitedList
    })
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
    clearInterval(this.timer)
    this.timer = null;
    wx.setStorageSync('redemptionCodeVisited', this.data.codesVisitedList)
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