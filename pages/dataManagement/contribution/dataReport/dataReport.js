// pages/dataReport.js
const app = getApp()
import {formatTime} from "../../../../utils/util.js"

Page({
  data: {
    time:'',
    formData:[]
  },
  async onShow() {
    try {
      this.initCurrentYearMonth();
      await this.checkHasItBeenSubmittedInBulkThisMonth();
      this.handleQuery();
    } catch (error) {}
  },
  initCurrentYearMonth(){
    this.setData({
      time: formatTime(new Date())
    });
  },
  async checkHasItBeenSubmittedInBulkThisMonth(){
    try {
      const res = await app.netQuery('GET',`/contributions/${this.data.time}/hasItBeenSubmittedInBulkThisMonth`);
      // console.log(res);
      if(res==='本月未上传'){
        return Promise.resolve();
      }else{
        return Promise.reject();
      }
    } catch (error) {
      wx.showToast({
        title:error.message,
        icon:'error'
      })
    }
  },
  async handleQuery(){
    try {
      const res = await app.netQuery('GET','/members');
      this.setData({
        formData:res.map((item)=>{
          return {
            id:item.id,
            quantity:0,
            name:item.name
          }
        })
      })
    } catch (error) {
      console.log(error)
      wx.showToast({
        title:error.message,
        icon:'error'
      })
    }
  },
  storeQuantityById(e){
    const newFormData = this.data.formData.map((item)=>{
      if(item.id !== e.currentTarget.dataset.id){
        return item;
      }else{
        return {
          ...item,
          quantity:Number(e.detail.value)
        }
      }
    })
    this.setData({
      formData:newFormData
    })
  },
  async handleAddContributionsMonthly(){
    try {
      const {formData,time} =  this.data;
      await app.netQuery("POST","/contributions/batch",{
        formData,
        time
      })
      await wx.showToast({
        title:'本月数据上传成功',
        icon:'success'
      })
      wx.navigateBack();
    } catch (error) {
      console.log(error);
      wx.showToast({
        title:error.title,
        icon:'error'
      })
    }
  }
})