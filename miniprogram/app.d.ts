/// <reference types="wechat-miniprogram" />

interface IAppOption {
  globalData: {
    userInfo: WechatMiniprogram.UserInfo | null
    openid: string
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback
}

type WeightRecord = import('./utils/types').WeightRecord
type DietRecord = import('./utils/types').DietRecord
type WorkoutRecord = import('./utils/types').WorkoutRecord
type WorkoutExercise = import('./utils/types').WorkoutExercise
type UserGoal = import('./utils/types').UserGoal
