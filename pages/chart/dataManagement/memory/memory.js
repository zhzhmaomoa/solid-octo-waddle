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
      // console.log(res);
      this.setData({
        memories:res
      })
    } catch (error) {
      console.log(error)
    }
  },
  toggleAddDialog(){
    this.setData({
      addDialogVisible:!this.data.addDialogVisible,
      memoryDetail:{
        id:undefined,
        date:undefined,
        src:undefined,
        title:undefined,
      }
    })
  },
  handleUploadImage(){
    const that = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album'],
      success(res) {
        console.log(res)
        that.setData({
          memoryDetail:{
            ...that.data.memoryDetail,
            src:res.tempFiles[0].tempFilePath
          }
        });
      }
    })
  },
  async handleAddMemory(){
    try {
      const {title,date,src} = this.data.memoryDetail;
      const fileID = await app.assetsUpload(src,title);
      await app.netQuery("POSt","/memory",{
        title,date,src:fileID
      });
      this.setData({
        addDialogVisible:false
      })
      this.handleQuery();
    } catch (error) {
      console.log(error);
    }
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
    const {id,src} = this.data.memoryDetail;
    try {
      await app.netQuery('DELETE','/memory',{id});
      await app.assetsDelete(src);
      await this.handleQuery();
      this.toggleDetailDialog();
    } catch (error) {
      console.log(error)
    }
  },
  async handleEdit(){
    try {
      await app.netQuery('PUT','/memory',this.data.memoryDetail);
      await this.handleQuery();
      this.toggleDetailDialog();
    } catch (error) {
      console.log(error)
    }
  },
  toggleDetailDialog(){
    this.setData({
      detailDialogVisible:!this.data.detailDialogVisible
    })
  }
})
