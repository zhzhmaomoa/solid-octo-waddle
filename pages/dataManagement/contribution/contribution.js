Page({
  toFormReport(){
    wx.navigateTo({
      url: '/pages/dataManagement/contribution/dataReport/dataReport',
    })
  },
  toManagementMonthly(){
    wx.navigateTo({
      url: '/pages/dataManagement/contribution/managementMonthly/managementMonthly',
    })
  }
})