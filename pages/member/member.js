// index.js
// 获取应用实例
const app = getApp()
Page({
  data: {
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
    }).catch((error)=>{
      console.log(error)
      wx.showToast({
        title:error.message,
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
