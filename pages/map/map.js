import {query} from "../../api/member.js"
import {citys} from "../../assets/citys.js"
Page({
  data: {
    latitude: 34.29078418888973,
    longitude: 108.9314268416977,
    markers: []
},
  onReady: function () {
    wx.showToast({
      title: '加载中',
      icon:"loading"
    })
    this.handleQuery();
  },
  onShow() {
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      const tabBar = this.getTabBar();
      tabBar.setSelectedByPath(this.route);
      const { windowWidth, windowHeight } = wx.getWindowInfo();
      tabBar.setHidden(windowWidth > windowHeight);
    }
  },
  async handleQuery(){
    try {
      const arr = await query({'pageNum':1,'pageSize':50})
      const markers = arr.map((item,index)=>{
        const citysIndex = citys.findIndex((city)=>{return item.province===city.name});
        const {subordinate,index:subordinateIndex} = citys[citysIndex];
        const city = subordinate[subordinateIndex];
        citys[citysIndex].index = (subordinate.length>subordinateIndex+1) ?(subordinateIndex+1):0;
        return {
          id: index,
          latitude:city.latitude,
          longitude:city.longitude,
          title:item.name,
          iconPath:item.iconPath,
          width:'50px',
          height:'50px'
        }
      })
      this.setData({
        markers
      })
      // console.log(markers)
    } catch (error) {
      console.error(error)
    }
  },
  onResize(res) {
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setHidden(res.size.windowWidth > res.size.windowHeight);
    }
  }
})
