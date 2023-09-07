// index.js
// 获取应用实例
const app = getApp()
Page({
  data: {
    members:[],
  },
  onReady(){
    this.getMembers();
  },
  getMembers(){
    app.netQuery('GET','/count',(res)=>{
      console.log(res,'data');
      this.setData({
        members:res
      })
    },);
  },
  handleSubmit(event){
    console.log(event);
    app.netQuery('POST','/members',)
  }
})
