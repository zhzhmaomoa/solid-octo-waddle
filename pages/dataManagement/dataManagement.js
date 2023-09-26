Page({
  toMemberManagement(){
    wx.navigateTo({
      url: '/pages/member/member',
    })
  },
  toContributionManagement(){
    wx.navigateTo({
      url: '/pages/contribution/contribution',
    })
  }
})