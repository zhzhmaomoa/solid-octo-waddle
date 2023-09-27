const app = getApp()
Page({
  data: {
    chartData: {},
    opts: {
        color:['#f72585','#b5179e','#7209b7','#560bad','#480ca8','#3a0ca3','#3f37c9','#4361ee','#4895ef','#4cc9f0'],
        enableScroll:true,
        dataLabel:false,
        xAxis: {
          disableGrid: true,
          itemCount:3,
        },
        yAxis: {
          data: [
            {
              min: 0
            }
          ]
        },
        extra:{
          tooltip:{
            showBox:false
          }
        }
      }
  },
  onShow() {
    this.getServerData();
  },
  async getServerData() {
     try {
       const res  = await app.netQuery("GET","/contributions")
       console.log(res);
      this.setData({ chartData: JSON.parse(JSON.stringify(res)) });
     } catch (error) {
      wx.showToast({
        title:error.message,
        icon:'error'
      })
    }
  },
  toDataManagement(){
    wx.navigateTo({
      url: '/pages/dataManagement/dataManagement',
    })
  }
})
