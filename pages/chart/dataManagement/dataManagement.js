Page({
  toMemberManagement(){
    wx.navigateTo({
      url: '/pages/chart/dataManagement/member/member',
    })
  },
  toContributionManagement(){
    wx.navigateTo({
      url: '/pages/chart/dataManagement/contribution/contribution',
    })
  },
  toMemory(){
    wx.navigateTo({
      url: '/pages/chart/dataManagement/memory/memory',
    })
  }
})