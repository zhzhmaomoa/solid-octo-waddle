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
    app.netQuery('GET','/api/count',(res)=>{
      console.log(res);
      this.setData({
        members:res.data.data
      })
    },(err)=>{
      console.log(err);
    });
  },
  handleSubmit(event){
    console.log(event);
  }
})
