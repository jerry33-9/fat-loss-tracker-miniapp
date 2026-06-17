import { today, formatDate } from '../../../utils/date'
import { exerciseCollection, addRecord } from '../../../utils/db'

// 粗略的热量估算 (kcal/分钟)
const CAL_PER_MIN: Record<string, number> = {
  '跑步': 10,
  '快走': 5,
  '游泳': 8,
  '骑行': 7,
  '跳绳': 11,
  '力量训练': 6,
  '瑜伽': 4,
  'HIIT': 12,
  '椭圆机': 7,
  '划船机': 8
}

Page({
  data: {
    date: today(),
    dateLabel: '',
    commonTypes: ['跑步', '快走', '游泳', '骑行', '跳绳', '力量训练', '瑜伽', 'HIIT'],
    exerciseType: '跑步',
    customType: '',
    duration: '',
    calories: '',
    estCalories: 0,
    quickDurations: [15, 20, 30, 45, 60, 90],
    selectedDur: 0,
    note: ''
  },

  onLoad() {
    const d = today()
    this.setData({ date: d, dateLabel: formatDate(d) })
  },

  onDateChange(e: any) {
    this.setData({ date: e.detail.value, dateLabel: formatDate(e.detail.value) })
  },

  selectType(e: any) {
    this.setData({ exerciseType: e.currentTarget.dataset.type, customType: '' }, () => this.estimate())
  },

  onCustomType(e: any) {
    this.setData({ customType: e.detail.value, exerciseType: '' }, () => this.estimate())
  },

  getEffectiveType(): string {
    return this.data.customType || this.data.exerciseType
  },

  onDurationInput(e: any) {
    this.setData({ duration: e.detail.value, selectedDur: 0 }, () => this.estimate())
  },

  setDuration(e: any) {
    const dur = e.currentTarget.dataset.dur
    this.setData({ duration: String(dur), selectedDur: dur }, () => this.estimate())
  },

  estimate() {
    const dur = Number(this.data.duration) || 0
    const rate = CAL_PER_MIN[this.getEffectiveType()] || 6
    const est = Math.round(dur * rate)
    this.setData({ estCalories: est })
  },

  onCalInput(e: any) {
    this.setData({ calories: e.detail.value })
  },

  onNoteInput(e: any) {
    this.setData({ note: e.detail.value })
  },

  async save() {
    const type = this.getEffectiveType()
    const duration = Number(this.data.duration)
    let calories = Number(this.data.calories)

    if (!type) {
      wx.showToast({ title: '请选择运动类型', icon: 'none' })
      return
    }
    if (!duration || duration <= 0) {
      wx.showToast({ title: '请输入运动时长', icon: 'none' })
      return
    }
    if (!calories) {
      calories = this.data.estCalories
    }

    wx.showLoading({ title: '保存中...' })
    try {
      await addRecord<ExerciseRecord>(exerciseCollection, {
        type,
        duration,
        calories,
        date: this.data.date,
        note: this.data.note,
        createdAt: Date.now()
      })
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
