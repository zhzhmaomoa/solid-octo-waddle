const app = getApp()
Page({
  data: {
    chartData: {},
    opts: {
        color:['#b8b099','#6e504e','#c3473b','#c67b3a','#363634','#c3473b',
        "#5A5C5B","#AE5E53","#DAD057","#747570","#23396B","#7AA3A9",
        '#b8b477','#877952','#ebe7db','#0242a3','#e76940','#576b84',
        '#e2efd1','#00715f','#d8c46b','#44454a','#b39437','#6e624c',
        '#6394b2','#ebded5','#8aaea2','#515254','#657471','#e4d18f',
        '#5e8389','#d64d43','#3e6f51','#5d898a','#194f7e','#b3b9af',
        '#c4c1ae','#b0c8bb','#e2bf9f','#f3f7dc','#ebdd3c','#c0a499',
        '#4c1992','#1f3696','#505050','#276793','#4e6046','#c85306','#a81367','#3e5f95'],
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
