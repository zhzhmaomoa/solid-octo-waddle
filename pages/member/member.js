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
    app.netQuery('GET','/members',(returnedData)=>{
      returnedData.then((data)=>{
        let result = data.map((item)=>{
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
      }).catch((data)=>{
        wx.showToast({
          title:data.message,
          icon:'error'
        })
      })
    },);
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
    app.netQuery('POST','/members',(rd)=>{
      rd.then(()=>{
        wx.showToast({
          title: '成功添加',
          icon: 'success',
        })
        this.handleQuery();
      }).catch((data)=>{
        wx.showToast({
          title: data.message,
          icon: 'error',
        })
      }).finally(()=>{
        this.setData({
          addDialogVisible:false
        })
      })
    },{name:this.data.addedMemberName})
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
    // console.log(this.data.memberDetail);
    const {id} = this.data.memberDetail
    app.netQuery('DELETE','/members',(res)=>{
      res.then((data)=>{
        if(data){
          wx.showToast({
            title:'已删除',
            icon:'success'
          })
          this.handleQuery();
        }
      }).catch((data)=>{
        wx.showToast({
          title:data.message,
          icon:'error'
        })
      })
    },{id})
    this.toggleDetailDialog();
  },
  handleEditOneName(){
    // console.log(this.data.memberDetail);
    const {id,name} = this.data.memberDetail
    app.netQuery('PUT','/members',(res)=>{
      res.then((data)=>{
        if(data.length===1){
          wx.showToast({
            title:'已修改',
            icon:'success'
          })
          this.handleQuery();
        }
      }).catch((data)=>{
        wx.showToast({
          title:data.message,
          icon:'error'
        })
      })
    },{id,name})
    this.toggleDetailDialog();
  },
  toggleDetailDialog(){
    this.setData({
      detailDialogVisible:!this.data.detailDialogVisible
    })
  }
})
