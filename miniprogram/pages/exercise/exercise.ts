import { formatDate } from '../../utils/date'
import { exerciseCollection } from '../../utils/db'

interface GroupedExercise {
  date: string
  dateLabel: string
  totalCalories: number
  records: ExerciseRecord[]
}

Page({
  data: {
    groupedRecords: [] as GroupedExercise[],
    totalRecords: 0
  },

  onShow() {
    this.loadRecords()
  },

  async loadRecords() {
    wx.showLoading({ title: '加载中...' })
    try {
      const res = await exerciseCollection.orderBy('date', 'desc').limit(60).get()
      const list = res.data as ExerciseRecord[]

      const grouped: Record<string, GroupedExercise> = {}
      list.forEach((r) => {
        if (!grouped[r.date]) {
          grouped[r.date] = {
            date: r.date,
            dateLabel: formatDate(r.date),
            totalCalories: 0,
            records: []
          }
        }
        grouped[r.date].records.push(r)
        grouped[r.date].totalCalories += r.calories
      })

      this.setData({
        groupedRecords: Object.values(grouped),
        totalRecords: list.length
      })
    } catch (e) {
      console.error(e)
    } finally {
      wx.hideLoading()
    }
  },

  goLog() { wx.navigateTo({ url: '/pages/exercise/log/log' }) }
})
