/// <reference types="wechat-miniprogram" />

interface IAppOption {
  globalData: {
    userInfo: WechatMiniprogram.UserInfo | null
    isCloudInit: boolean
    targetWeight: number
    currentWeight: number
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback
}

// 类型别名（页面和组件中直接使用 types.ts 导出的类型）
type WeightRecord = import('./utils/types').WeightRecord
type DietRecord = import('./utils/types').DietRecord
type ExerciseRecord = import('./utils/types').ExerciseRecord
type UserGoal = import('./utils/types').UserGoal
