import { today, formatDate } from '../../../utils/date'
import { addWorkout } from '../../../utils/api'

interface ExItem {
  name: string
  sets: number
  reps: number
  weight?: number
  moveIndex: number
}

Page({
  data: {
    date: today(),
    dateLabel: '',
    commonMoves: ['卧推', '深蹲', '硬拉', '引体向上', '划船', '推举', '弯举', '臂屈伸', '卷腹', '平板支撑'],
    exercises: [
      { name: '', sets: 3, reps: 10, weight: 0, moveIndex: -1 }
    ] as ExItem[],
    duration: '',
    note: '',
    totalSets: 0
  },

  onLoad() {
    const d = today()
    this.setData({ date: d, dateLabel: formatDate(d) })
    this.calcTotal()
  },

  onDateChange(e: any) {
    this.setData({ date: e.detail.value, dateLabel: formatDate(e.detail.value) })
  },

  addExercise() {
    this.setData({
      exercises: [...this.data.exercises, { name: '', sets: 3, reps: 10, weight: 0, moveIndex: -1 }]
    }, () => this.calcTotal())
  },

  removeExercise(e: any) {
    const idx = e.currentTarget.dataset.index
    if (this.data.exercises.length <= 1) return
    const exercises = this.data.exercises.filter((_, i) => i !== idx)
    this.setData({ exercises }, () => this.calcTotal())
  },

  onMovePick(e: any) {
    const idx = e.currentTarget.dataset.index
    const moveIdx = Number(e.detail.value)
    const exercises = [...this.data.exercises]
    exercises[idx] = {
      ...exercises[idx],
      name: this.data.commonMoves[moveIdx],
      moveIndex: moveIdx
    }
    this.setData({ exercises })
  },

  onExChange(e: any) {
    const { index, field } = e.currentTarget.dataset
    let value: any = e.detail.value
    if (field === 'sets' || field === 'reps') value = Number(value) || 0
    if (field === 'weight') value = Number(value) || undefined
    const exercises = [...this.data.exercises]
    exercises[index] = { ...exercises[index], [field]: value, moveIndex: -1 }
    this.setData({ exercises }, () => this.calcTotal())
  },

  adjustNum(e: any) {
    const { index, field, delta } = e.currentTarget.dataset
    const exercises = [...this.data.exercises]
    const cur = exercises[index][field as keyof ExItem] as number
    const val = Math.max(0, (cur || 0) + Number(delta))
    exercises[index] = { ...exercises[index], [field]: val, moveIndex: -1 }
    this.setData({ exercises }, () => this.calcTotal())
  },

  calcTotal() {
    const totalSets = this.data.exercises.reduce((sum, ex) => sum + (ex.sets || 0), 0)
    this.setData({ totalSets })
  },

  onDurationInput(e: any) {
    this.setData({ duration: e.detail.value })
  },

  onNoteInput(e: any) {
    this.setData({ note: e.detail.value })
  },

  async save() {
    const valid = this.data.exercises.filter(ex => ex.name.trim())
    if (valid.length === 0) {
      wx.showToast({ title: '请至少填写一个动作名称', icon: 'none' })
      return
    }

    wx.showLoading({ title: '保存中...' })
    try {
      const exercises = valid.map(ex => ({
        name: ex.name.trim(),
        sets: ex.sets || 0,
        reps: ex.reps || 0,
        weight: ex.weight || undefined
      }))

      const duration = Number(this.data.duration) || 0
      const calories = Math.round(duration * 6) // 粗略估算

      await addWorkout({ date: this.data.date, exercises, duration, calories, note: this.data.note })
      wx.showToast({ title: '已保存', icon: 'success' })
      setTimeout(() => wx.navigateBack(), 1500)
    } catch (e) {
      console.error(e)
      wx.showToast({ title: '保存失败', icon: 'none' })
    } finally {
      wx.hideLoading()
    }
  }
})
