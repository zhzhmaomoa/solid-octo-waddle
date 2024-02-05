// index.js
// 获取应用实例
const app = getApp()
Page({
  data: {
    members:[],
    addDialogVisible:false,
    detailDialogVisible:false,
    memberDetail:{
      id:0,
      name:undefined,
      iconPath:undefined,
      latitude:undefined,
      longitude:undefined,
      createdAt:undefined,
      updatedAt:undefined,
    },
    oldIconPath:undefined
  },
  onReady(){
    this.handleQuery();
  },
  async handleQuery(){
    try {
      const res = await app.netQuery('GET','/members');
      const members = res.map((item)=>{
        const createdAt =  item.createdAt.slice(0,10);
        let updatedAt = item.updatedAt.slice(0,10);
        return {
          ...item,
          createdAt,
          updatedAt,
        };
      })
      // console.log(members)
      this.setData({
        members
      })
    } catch (error) {
      console.log(error);
    }
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
  storeDetailInputLatitude(event){
    const {value} = event.detail;
    this.setData({
      memberDetail:{
        ...this.data.memberDetail,
        latitude:value
      }
    })
  },
  storeDetailInputLongitude(event){
    const {value} = event.detail;
    this.setData({
      memberDetail:{
        ...this.data.memberDetail,
        longitude:value
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
          memberDetail:{
            ...that.data.memberDetail,
            iconPath:res.tempFiles[0].tempFilePath,
          }
        });
      }
    })
  },
  toggleAddDialog(){
    this.setData({
      addDialogVisible:!this.data.addDialogVisible,
      memberDetail:{
        id:0,
        name:undefined,
        iconPath:undefined,
        latitude:undefined,
        longitude:undefined,
        createdAt:undefined,
        updatedAt:undefined,
      }
    })
  },
  async handleAddMember(){
    try {
      const {name,iconPath,longitude,latitude} = this.data.memberDetail;
      const fileID = await app.assetsUpload(iconPath,name,'map-markers-icon');
      await app.netQuery('POST','/members',{
        name,
        iconPath:fileID,
        longitude,
        latitude
      });
      await this.handleQuery();
      this.setData({
        addDialogVisible:false
      })
    } catch (error) {
      console.log(error)
    }
  },
  toggleDetailDialog(){
    this.setData({
      detailDialogVisible:!this.data.detailDialogVisible
    })
  },
  handleQueryDetail(event){
    const {detail } = event.currentTarget.dataset;
    this.setData({
      memberDetail:detail,
      oldIconPath:detail.iconPath
    })
    this.toggleDetailDialog();
  },
  async handleDelete(){
    const {id,iconPath} = this.data.memberDetail
    try {
      await app.netQuery('DELETE','/members',{id});
      await app.assetsDelete(iconPath);
      await this.handleQuery();
      this.toggleDetailDialog();
    } catch (error) {
      console.log(error);
    }
  },
  async handleEdit(){
    try {
      const {id,name,iconPath,latitude,longitude} = this.data.memberDetail;
      let fileId = iconPath;
      if(this.data.oldIconPath !== iconPath){
        console.log(this.data.oldIconPath);
        await app.assetsDelete(this.data.oldIconPath);
        fileId = await app.assetsUpload(iconPath,encodeUnicode(name),'map-markers-icon');
      }
      await app.netQuery('PUT','/members',{
        id,name,latitude,longitude,
        iconPath:fileId
      });
      await this.handleQuery();
      this.toggleDetailDialog();
    } catch (error) {
      console.log(error);
    }
  }
})
function encodeUnicode(str) {
  let res = [];
  for (let i = 0; i < str.length; i++) {
      res[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
  }
  return  res.join("");
}