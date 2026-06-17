import { login } from './utils/api'

App<IAppOption>({
  globalData: {
    userInfo: null,
    openid: ''
  },

  onLaunch() {
    login().then((openid) => {
      console.log('登录成功', openid)
    }).catch((err) => {
      console.error('登录失败', err)
    })
  }
})
