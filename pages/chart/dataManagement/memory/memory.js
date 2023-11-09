// index.js
// 获取应用实例
const app = getApp()
Page({
  data: {
    memories:[],
    addDialogVisible:false,
    addedTitle:undefined,
    detailDialogVisible:false,
    memoryDetail:{
      id:undefined,
      date:undefined,
      src:undefined,
      title:undefined,
    }
  },
  onReady(){
    this.handleQuery();
  },
  async handleQuery(){
    try {
      const res = await app.netQuery('GET','/memory');
      console.log(res);
      this.setData({
        memories:res
      })
    } catch (error) {
      console.log(error)
    }
  },
  toggleAddDialog(){
    this.setData({
      addDialogVisible:!this.data.addDialogVisible
    })
  },
  storeAddedTitle(event){
    const {value} = event.detail;
    this.setData({
      addedTitle:value
    })
  },
  handleAddMemory(){
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
  async handleQueryDetail(event){
    const {detail} = event.currentTarget.dataset;
    this.setData({
      memoryDetail:detail
    })
    this.toggleDetailDialog();
  },
  storeDetailInputTitle(event){
    const {value} = event.detail;
    this.setData({
      memoryDetail:{
        ...this.data.memoryDetail,
        title:value
      }
    })
  },
  storeDetailInputDate(event){
    const {value} = event.detail;
    this.setData({
      memoryDetail:{
        ...this.data.memoryDetail,
        date:value
      }
    })
  },
  async handleDelete(){
    const {id} = this.data.memoryDetail;
    try {
      await app.netQuery('DELETE','/memory',{id});
      this.handleQuery();
    } catch (error) {
      console.log(error)
    } finally{
      this.toggleDetailDialog();
    }
  },
  async handleEdit(){
    try {
      await app.netQuery('PUT','/memory',this.data.memoryDetail);
      this.handleQuery();
    } catch (error) {
      console.log(error)
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
