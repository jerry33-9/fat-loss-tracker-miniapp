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

/** 训练记录 */
interface WorkoutRecord {
  _id?: string
  date: string
  exercises: WorkoutExercise[]
  duration: number
  calories: number
  note?: string
}

interface WorkoutExercise {
  name: string
  sets: number
  reps: number
  weight?: number
}

/** 用户目标 */
interface UserGoal {
  _id?: string
  targetWeight: number
  startWeight: number
  weeklyTarget: number
  startDate: string
}
