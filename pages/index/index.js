// index.js
// 获取应用实例
const app = getApp()
Page({
  data: {
    members:[],
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
          // if(createdAt === updatedAt){
          //   updatedAt = ""
          // }
          return {
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
  handleAddMember(){
    wx.showModal({
      title: '新增成员',
      editable:true,
      placeholderText:'成员名',
      success (res) {
        if (res.confirm) {
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
            })
          },{name:res.content})
        }
      }
    })
  }
})
