/// <reference types="wechat-miniprogram" />

interface IAppOption {
  globalData: {
    userInfo: WechatMiniprogram.UserInfo | null
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback
}

type WeightRecord = import('./utils/types').WeightRecord
type DietRecord = import('./utils/types').DietRecord
type ExerciseRecord = import('./utils/types').ExerciseRecord
type UserGoal = import('./utils/types').UserGoal
