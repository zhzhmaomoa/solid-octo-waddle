Page({
  data: {
    hasAirplaneTakenOff:false,
  },
  toggleAirplaneStatus(){
    this.setData({
      hasAirplaneTakenOff:!this.data.hasAirplaneTakenOff
    })
  },
  toChart(){
    wx.navigateTo({
      url: '/pages/chart/chart',
    })
  },
  toMap(){
    wx.navigateTo({
      url: '/pages/map/map',
    })
  }

})