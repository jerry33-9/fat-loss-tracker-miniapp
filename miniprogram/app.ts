App<IAppOption>({
  globalData: {
    userInfo: null
  },

  onLaunch() {
    // 检查登录态
    wx.login({
      success: () => {
        // 将 code 发送给后端换取 openid / token
      }
    })
  }
})
