/// <reference types="wechat-miniprogram" />

interface IAppOption {
  globalData: {
    openid: string
  }
}

type WorkoutRecord = import('./utils/types').WorkoutRecord
type WorkoutExercise = import('./utils/types').WorkoutExercise
