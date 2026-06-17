/** 体重记录 */
interface WeightRecord {
  _id?: string
  weight: number
  date: string
  note?: string
}

/** 饮食记录 */
interface DietRecord {
  _id?: string
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  date: string
  foods: FoodItem[]
  totalCalories: number
  photoUrls: string[]
  note?: string
}

interface FoodItem {
  name: string
  amount: string
  calories: number
}

/** 运动记录 */
interface ExerciseRecord {
  _id?: string
  type: string
  duration: number
  calories: number
  date: string
  note?: string
}

/** 用户目标 */
interface UserGoal {
  _id?: string
  targetWeight: number
  startWeight: number
  weeklyTarget: number
  startDate: string
}
