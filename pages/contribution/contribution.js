Page({
  toSumbitManagement(){
    wx.navigateTo({
      url: '/pages/member/member',
    })
  },
  toManagementMonthly(){
    wx.navigateTo({
      url: '/pages/managementMonthly/managementMonthly',
    })
  }
})