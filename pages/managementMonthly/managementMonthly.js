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
    members:[],
    addDialogVisible:false,
    addedMemberName:'',
    detailDialogVisible:false,
    memberDetail:{
      id:0,
      name:'',
      createdAt:'',
      updatedAt:'',
    }
  },
  onReady(){
    this.handleQuery();
    this.initCurrentYearMonth();
  },
  initCurrentYearMonth(){
    const time = formatTime(new Date());
    //construct selectedTimeList;e.g.,time:2023/09 => selectedTimeList:[1,8],the 1 refer to index of 2023 in yearArr etc.
    let timeArr = time.split("/");
    timeArr[0]  = yearArr.findIndex((year)=>year===timeArr[0]);
    timeArr[1] = monthArr.findIndex((month)=>month===timeArr[1]);
    this.setData({
      time,
      selectedTimeList:timeArr
    });
  },
  handleQuery(){
    app.netQuery('GET','/members').then((res)=>{
      let result = res.map((item)=>{
        const createdAt =  item.createdAt.slice(0,10);
        let updatedAt = item.updatedAt.slice(0,10);
        return {
          id:item.id,
          name:item.name,
          createdAt,
          updatedAt,
        };
      })
      this.setData({
        members:result
      })
    }).catch((err)=>{
      wx.showToast({
        title:err,
        icon:'error'
      })
    })
  },
  toggleTimePickerDialog(){
    this.setData({
      timePickerDialogVisible:!this.data.timePickerDialogVisible
    });
  },
  handleTimePickerChange(){
    console.log(e.detail);
  },
  toggleAddDialog(){
    this.setData({
      addDialogVisible:!this.data.addDialogVisible
    })
  },
  storeAddedMemberName(event){
    const {value} = event.detail;
    this.setData({
      addedMemberName:value
    })
  },
  handleAddMember(){
    app.netQuery('POST','/members',{name:this.data.addedMemberName}).then(()=>{
      wx.showToast({
        title: '成功添加',
        icon: 'success',
      })
      this.handleQuery();
    }).catch((err)=>{
      wx.showToast({
        title:err,
        icon: 'error',
      })
    }).finally(()=>{
      this.setData({
        addDialogVisible:false
      })
    })
  },
  handleQueryDetail(event){
    const {detail } = event.currentTarget.dataset;
    this.setData({
      memberDetail:detail
    })
    this.toggleDetailDialog();
  },
  storeDetailInputName(event){
    const {value} = event.detail;
    this.setData({
      memberDetail:{
        ...this.data.memberDetail,
        name:value
      }
    })
  },
  handleDeteleOne(){
    const {id} = this.data.memberDetail
    app.netQuery('DELETE','/members',{id}).then(()=>{
        wx.showToast({
          title:'已删除',
          icon:'success'
        })
        this.handleQuery();
    }).catch((data)=>{
      wx.showToast({
        title:data.message,
        icon:'error'
      })
    }).finally(()=>{
      this.toggleDetailDialog();
    })
  },
  handleEditOneName(){
    const {id,name} = this.data.memberDetail;
    app.netQuery('PUT','/members',{id,name}).then((res)=>{
      if(res.length===1){
        wx.showToast({
          title:'已修改',
          icon:'success'
        })
        this.handleQuery();
      }
    }).catch((err)=>{
      wx.showToast({
        title:err,
        icon:'error'
      })
    }).finally(()=>{
      this.toggleDetailDialog();
    })
  },
  toggleDetailDialog(){
    this.setData({
      detailDialogVisible:!this.data.detailDialogVisible
    })
  }
})

