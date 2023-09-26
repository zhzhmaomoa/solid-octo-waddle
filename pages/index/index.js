const app = getApp()
Page({
  data: {
    chartData: {},
    opts: {
        enableScroll:true,
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