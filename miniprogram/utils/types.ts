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
