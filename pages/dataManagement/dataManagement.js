Page({
  toMemberManagement(){
    wx.navigateTo({
      url: '/pages/dataManagement/member/member',
    })
  },
  toContributionManagement(){
    wx.navigateTo({
      url: '/pages/dataManagement/contribution/contribution',
    })
  }
})