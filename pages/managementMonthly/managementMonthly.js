// index.js
// 获取应用实例
const app = getApp()
import {formatTime} from "../../utils/util.js"
const time = new Date();
let yearArr = [];
for(let i=2022;i<=time.getFullYear();i++){
  yearArr.push(i+"");
}
let monthArr =[];
for(let i = 1;i<=12;i++){
  let temp = i.toString();
  monthArr.push(temp[1]?temp:`0${temp}`);
}
Page({
  data: {
    time:'',//年和月份
    selectedTimeList:[],//下标0映射yearArr中的年份，下标1映射monthArr中的月份
    timePickerDialogVisible:false,
    yearArr,
    monthArr,
    contributionsData:[],
    members:[],
    addDialogVisible:false,
    selectedMemberId:'',
    contributionsForAdd:'',
    detailDialogVisible:false,
    memberContributionDetail:{
      id:0,
      quantity:0,
      time:'',
      Member:{
        id:0,
        name:''
      }
    }
  },
  onShow(){
    this.initCurrentYearMonth();
    this.handleQuery();
  },
  initCurrentYearMonth(){
    const time = formatTime(new Date());
    //construct selectedTimeList;e.g.,time:2023-09 => selectedTimeList:[1,8],the 1 refer to index of 2023 in yearArr etc.
    let timeArr = time.split("-");
    timeArr[0]  = yearArr.findIndex((year)=>year===timeArr[0]);
    timeArr[1] = monthArr.findIndex((month)=>month===timeArr[1]);
    this.setData({
      time,
      selectedTimeList:timeArr
    });
  },
  async handleQuery(){
    try {
      const res = await app.netQuery('GET','/contributions/'+this.data.time);
      // console.log(res);
      this.setData({
        contributionsData:res
      })
    } catch (err) {
      console.log(err);
      wx.showToast({
        title:err.message,
        icon: 'error',
      })
    }
  },
  toggleTimePickerDialog(){
    this.setData({
      timePickerDialogVisible:!this.data.timePickerDialogVisible
    });
    if(!this.data.timePickerDialogVisible){
      this.handleQuery();
    }
  },
  handleTimePickerChange(e){
    const dateList = e.detail.value;
    this.setData({
      selectedTimeList:dateList,
      time:yearArr[dateList[0]]+'-'+monthArr[dateList[1]]
    })
  },
  async toggleAddDialog(){
    this.setData({
      addDialogVisible:!this.data.addDialogVisible
    });
    if(this.data.addDialogVisible){
      try {
        const res = await app.netQuery('GET','/members')
        this.setData({  
          members:res,
          selectedMemberId:res[0].id
        })
      } catch (error) {
        wx.showToast({
          title:error,
          icon:'error'
        })
      }
    }
  },
  storeSelectedMember(event){
    const {member } = event.currentTarget.dataset;
    this.setData({
      selectedMemberId:member
    })
  },
  storeAddedContributions(e){
    const {value} = e.detail;
    this.setData({
      contributionsForAdd:value
    })
  },
  async handleAddContributions(){
    const {time,selectedMemberId,contributionsForAdd} = this.data;
    try {
      await app.netQuery('POST','/contributions',{MemberId:selectedMemberId,time,quantity:contributionsForAdd})
      wx.showToast({
        title: '成功添加',
        icon: 'success',
      })
      this.handleQuery();
    } catch (err) {
      console.log(err);
      wx.showToast({
        title:err.message,
        icon: 'error',
      })
    }finally{
      this.setData({
        addDialogVisible:false
      })
    }
  },
  handleQueryDetail(event){
    const {detail } = event.currentTarget.dataset;
    this.setData({
      memberContributionDetail:detail
    })
    this.toggleDetailDialog();
  },
  storeDetailInputQuantity(event){
    const {value} = event.detail;
    this.setData({
      memberContributionDetail:{
        ...this.data.memberContributionDetail,
        quantity:value
      }
    })
  },
  async handleDeteleOne(){
    const {id} = this.data.memberContributionDetail
    try {
      await app.netQuery('DELETE','/contributions',{id});
      wx.showToast({
        title:'已删除',
        icon:'success'
      });
      this.handleQuery();
    }catch (err) {
      console.log(err);
      wx.showToast({
        title:err.message,
        icon: 'error',
      })
    }finally{
      this.toggleDetailDialog();
    }
  },
  async handleEditOneQuantity(){
    const {id,quantity} = this.data.memberContributionDetail;
    try {
      await app.netQuery('PUT','/contributions',{id,quantity});
      wx.showToast({
        title:'已修改',
        icon:'success'
      })
      this.handleQuery();
    } catch (error) {
      console.log(error);
      wx.showToast({
        title:error.message,
        icon: 'error',
      })
    }finally{
      this.toggleDetailDialog();
    }
  },
  toggleDetailDialog(){
    this.setData({
      detailDialogVisible:!this.data.detailDialogVisible
    })
  }
})

