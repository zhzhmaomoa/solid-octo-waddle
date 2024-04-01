// pages/redemptionCode/redemptionCode.js
import {query} from "../../api/redemptionCode.js"
Page({
  data: {
    codes:[],
    codesVisitedList:[],
    timeList:[]
  },
  pageSize:6,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.handleQuery()
    this.setData({
      codesVisitedList: wx.getStorageSync('redemptionCodeVisited')||new Array(this.pageSize).fill(false)
    })
    console.log(wx.getStorageSync('redemptionCodeVisited'))
  },
  async handleQuery(){
    try {
      const codes = await query({'pageNum':1,'pageSize':this.pageSize});
      this.splitCodes(codes);
    } catch (error) {
      console.error(error)
    }
  },
  splitCodes(codes){
    const targetCodes = [], timeList = [];
    for(let i = 0; i < codes.length; i++){
      const {deadline,...extra} = codes[i];
      targetCodes.push({...extra, status:i===0?'current':'', clicked:false});
      timeList.push(computeTimeItem(deadline))
    }
    this.setData({codes:targetCodes});
    this.countdown(timeList);
  },
  timer:null,
  countdown(timeList){
    this.timer = setInterval(()=>{
      for(let i = 0; i < timeList.length; i++){
        if(timeList[i].deadlineActive){
          const result = timeList[i].deadline.reduce((pv,cv)=>{return pv+cv},0);
          if(result <= 0){
            timeList[i].deadlineActive = false;
            continue;
          }
        }else{
          continue;
        }
        timeList[i].deadline[2]--;
        if(timeList[i].deadline[2]<0){
          timeList[i].deadline[1]--;
          timeList[i].deadline[2] = 59;
          if(timeList[i].deadline[1]<0){
            timeList[i].deadline[0]--;
            timeList[i].deadline[1] = 59;
            if(timeList[i].deadline[0]<=0){
              timeList[i].deadline = [0,0,0]
              continue;
            }
          }
        }
      }
      this.setData({
        timeList
      })
    },1000)
  },
  handleCopy(e){
    console.log(e)
    const {redemptionCode,index} =  e.detail
    wx.setClipboardData({
      data:redemptionCode
    })
    this.data.codesVisitedList.splice(index,1,true);
    this.setData({
      codesVisitedList:this.data.codesVisitedList
    })
  },

  onUnload() {
    clearInterval(this.timer)
    this.timer = null;
    wx.setStorageSync('redemptionCodeVisited', this.data.codesVisitedList)
    console.log(wx.getStorageSync('redemptionCodeVisited'))
  },

})
const dateNow = new Date();
function computeTimeItem(deadlineString){
  const deadline = new Date(deadlineString);
  let timeInterval = parseInt((deadline-dateNow)/1000);
  const seconds = timeInterval%60;
  timeInterval = parseInt(timeInterval/60);
  const minutes = timeInterval%60;
  timeInterval =  parseInt(timeInterval/60);
  const hours = timeInterval;
  const dateArr = [hours>0?hours:0,minutes>0?minutes:0,seconds>0?seconds:0];
  const result = dateArr.reduce((pv,cv)=>{return pv+cv},0);
  return {
    deadlineActive : result<=0?false:true,
    deadline:dateArr
  }
}