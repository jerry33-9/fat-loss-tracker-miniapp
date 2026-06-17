import { today, formatDate } from '../../../utils/date'
import { weightCollection, addRecord } from '../../../utils/db'

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
    this.generateQuickWeights()
  },

  async loadLastRecord() {
    try {
      const res = await weightCollection.orderBy('date', 'desc').limit(1).get()
      if (res.data.length > 0) {
        const r = res.data[0] as WeightRecord
        this.setData({
          lastRecord: { ...r, dateLabel: formatDate(r.date) }
        })
      }
    } catch (e) { /* ignore */ }
  },

  generateQuickWeights() {
    const { lastRecord } = this.data
    if (lastRecord) {
      const base = lastRecord.weight
      this.setData({
        quickWeights: [
          Math.round((base - 0.5) * 10) / 10,
          Math.round((base - 0.2) * 10) / 10,
          base,
          Math.round((base + 0.2) * 10) / 10,
          Math.round((base + 0.5) * 10) / 10
        ]
      })
    } else {
      this.setData({
        quickWeights: [50, 55, 60, 65, 70, 75, 80, 85, 90]
      })
    }
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
      await addRecord<WeightRecord>(weightCollection, {
        weight,
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
