/** 体重记录 */
interface WeightRecord {
  _id?: string
  _openid?: string
  weight: number       // kg
  date: string         // YYYY-MM-DD
  note?: string
  createdAt: number
}

/** 饮食记录 */
interface DietRecord {
  _id?: string
  _openid?: string
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  date: string
  foods: FoodItem[]
  totalCalories: number
  photoUrls: string[]
  note?: string
  createdAt: number
}

interface FoodItem {
  name: string
  amount: string       // e.g. "200g", "1碗"
  calories: number
  protein?: number
  fat?: number
  carbs?: number
}

/** 运动记录 */
interface ExerciseRecord {
  _id?: string
  _openid?: string
  type: string          // e.g. "跑步", "游泳", "力量训练"
  duration: number      // minutes
  calories: number
  date: string
  note?: string
  createdAt: number
}

/** 用户目标 */
interface UserGoal {
  _id?: string
  _openid?: string
  targetWeight: number
  startWeight: number
  weeklyTarget: number   // kg per week
  startDate: string
  updatedAt: number
}

/** 体重趋势数据点 */
interface TrendPoint {
  date: string
  weight: number
  label: string
}
