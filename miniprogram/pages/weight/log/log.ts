import { today, formatDate } from '../../../utils/date'
import { getWeights, addWeight } from '../../../utils/api'

Page({
  data: {
    date: today(),
    dateLabel: '',
    weight: '',
    note: '',
    quickWeights: [] as number[],
    selectedQuick: -1,
    lastRecord: null as any
  },

  onLoad() {
    const d = today()
    this.setData({ date: d, dateLabel: formatDate(d) })
    this.loadLastRecord()
  },

  async loadLastRecord() {
    try {
      const weights = await getWeights({ limit: 1 })
      if (weights.length > 0) {
        const r = weights[0]
        this.setData({
          lastRecord: { ...r, dateLabel: formatDate(r.date) },
          quickWeights: [
            Math.round((r.weight - 0.5) * 10) / 10,
            Math.round((r.weight - 0.2) * 10) / 10,
            r.weight,
            Math.round((r.weight + 0.2) * 10) / 10,
            Math.round((r.weight + 0.5) * 10) / 10
          ]
        })
      } else {
        this.setData({
          quickWeights: [50, 55, 60, 65, 70, 75, 80, 85, 90]
        })
      }
    } catch (e) { /* ignore */ }
  },

  onDateChange(e: any) {
    const date = e.detail.value
    this.setData({ date, dateLabel: formatDate(date) })
  },

  onWeightInput(e: any) {
    this.setData({ weight: e.detail.value, selectedQuick: -1 })
  },

  setQuickWeight(e: any) {
    const w = e.currentTarget.dataset.weight
    this.setData({ weight: String(w), selectedQuick: w })
  },

  onNoteInput(e: any) {
    this.setData({ note: e.detail.value })
  },

  async save() {
    const weight = parseFloat(this.data.weight)
    if (!weight || weight < 20 || weight > 300) {
      wx.showToast({ title: '请输入有效体重', icon: 'none' })
      return
    }

    wx.showLoading({ title: '保存中...' })
    try {
      await addWeight({
        weight,
        date: this.data.date,
        note: this.data.note
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
