Page({
  toFormReport(){
    wx.navigateTo({
      url: '/pages/dataReport/dataReport',
    })
  },
  toManagementMonthly(){
    wx.navigateTo({
      url: '/pages/managementMonthly/managementMonthly',
    })
  }
})