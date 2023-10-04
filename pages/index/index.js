const app = getApp()
import uCharts from '../../utils/u-charts.min.js';
var uChartsInstance = {};
Page({
  data: {
    pixelRatio: 2,
    hasAirplaneTakenOff:false,
  },
  onReady() {
    const pixelRatio = wx.getSystemInfoSync().pixelRatio;
    this.setData({pixelRatio });
    this.getServerData();
  },
  async getServerData() {
    try {
      const res  = await app.netQuery("GET","/contributions")
      this.drawCharts('GQMhlpUKrZJhdaZpkiTnMhfLEqdZkOPs', res);
    } catch (error) {
     wx.showToast({
       title:error.message,
       icon:'error'
     })
   }
 },
  drawCharts(id,data){
    const query = wx.createSelectorQuery().in(this);
    query.select('#' + id).fields({ node: true, size: true }).exec(res => {
      if (res[0]) {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        canvas.width = res[0].width*this.data.pixelRatio;
        canvas.height = res[0].height*this.data.pixelRatio;
        uChartsInstance[id] = new uCharts({
            type: "line",
            context: ctx,
            width: res[0].width*this.data.pixelRatio,
            height: res[0].height*this.data.pixelRatio,
            pixelRatio:this.data.pixelRatio,
            categories: data.categories,
            series: data.series,
            background: "#000814",
            color:['#b8b099','#6e504e','#c3473b','#c67b3a','#363634','#c3473b',
            "#5A5C5B","#AE5E53","#DAD057","#747570","#23396B","#7AA3A9",
            '#b8b477','#877952','#ebe7db','#0242a3','#e76940','#576b84',
            '#e2efd1','#00715f','#d8c46b','#44454a','#b39437','#6e624c',
            '#6394b2','#ebded5','#8aaea2','#515254','#657471','#e4d18f',
            '#5e8389','#d64d43','#3e6f51','#5d898a','#194f7e','#b3b9af',
            '#c4c1ae','#b0c8bb','#e2bf9f','#f3f7dc','#ebdd3c','#c0a499',
            '#4c1992','#1f3696','#505050','#276793','#4e6046','#c85306','#a81367','#3e5f95'],
            dataLabel:false,
            yAxis: {
              disableGrid: true,
            },
            extra:{
              line:{
                width:1
              }
            }
          });
      }else{
        console.error("[uCharts]: 未获取到 context");
      }
    });
  },
  tap(e) {
    uChartsInstance[e.target.id].touchLegend(e);
  },
  toggleAirplaneStatus(){
    this.setData({
      hasAirplaneTakenOff:!this.data.hasAirplaneTakenOff
    })
  },
  toDataManagement(){
    wx.navigateTo({
      url: '/pages/dataManagement/dataManagement',
    })
  },
  toMap(){
    wx.navigateTo({
      url: '/pages/map/map',
    })
  }
})
