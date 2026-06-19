import { formatDate } from '../../utils/date'
import { getWorkouts } from '../../utils/api'

interface GroupedWorkout {
  date: string
  dateLabel: string
  totalCalories: number
  exerciseCount: number
  totalSets: number
  records: WorkoutRecord[]
}

Page({
  data: {
    groupedRecords: [] as GroupedWorkout[],
    totalRecords: 0
  },

  onShow() {
    this.loadRecords()
  },

  async loadRecords() {
    wx.showLoading({ title: '加载中...' })
    try {
      const list = await getWorkouts({})

      const grouped: Record<string, GroupedWorkout> = {}
      list.forEach((r) => {
        if (!grouped[r.date]) {
          grouped[r.date] = {
            date: r.date,
            dateLabel: formatDate(r.date),
            totalCalories: 0,
            exerciseCount: 0,
            totalSets: 0,
            records: []
          }
        }
        grouped[r.date].records.push(r)
        grouped[r.date].totalCalories += r.calories || 0
        grouped[r.date].exerciseCount += r.exercises?.length || 0
        grouped[r.date].totalSets += r.exercises?.reduce((s, e) => s + (e.sets || 0), 0) || 0
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
