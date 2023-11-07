Page({
  toFormReport(){
    wx.navigateTo({
      url: '/pages/chart/dataManagement/contribution/dataReport/dataReport',
    })
  },
  toManagementMonthly(){
    wx.navigateTo({
      url: '/pages/chart/dataManagement/contribution/managementMonthly/managementMonthly',
    })
  }
})