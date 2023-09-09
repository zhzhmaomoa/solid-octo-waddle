Page({
  toMemberManagement(){
    wx.navigateTo({
      url: '/pages/member/member',
    })
  },
  toContributionManaement(){
    wx.navigateTo({
      url: '/pages/contribution/contribution',
    })
  }
})