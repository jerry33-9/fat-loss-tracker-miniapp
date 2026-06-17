interface IAppOption {
  globalData: {
    userInfo: WechatMiniprogram.UserInfo | null
    isCloudInit: boolean
    targetWeight: number
    currentWeight: number
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback
}

declare namespace wx {
  namespace db {
    const command: any
    const Command: any
  }
}

type WeightRecord = import('./utils/types').WeightRecord
type DietRecord = import('./utils/types').DietRecord
type ExerciseRecord = import('./utils/types').ExerciseRecord
type UserGoal = import('./utils/types').UserGoal
