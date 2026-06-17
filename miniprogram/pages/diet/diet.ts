import { formatDate } from '../../utils/date'
import { getDiets } from '../../utils/api'

const MEAL_CONFIG: Record<string, { label: string; emoji: string }> = {
  breakfast: { label: '早餐', emoji: '🌅' },
  lunch: { label: '午餐', emoji: '☀️' },
  dinner: { label: '晚餐', emoji: '🌙' },
  snack: { label: '加餐', emoji: '🍪' }
}

interface GroupedMeal {
  date: string
  dateLabel: string
  meals: (DietRecord & { label: string; emoji: string })[]
}

Page({
  data: {
    groupedRecords: [] as GroupedMeal[],
    totalRecords: 0
  },

  onShow() {
    this.loadRecords()
  },

  async loadRecords() {
    wx.showLoading({ title: '加载中...' })
    try {
      const list = await getDiets({})

      const grouped: Record<string, GroupedMeal> = {}
      list.forEach((r) => {
        if (!grouped[r.date]) {
          grouped[r.date] = { date: r.date, dateLabel: formatDate(r.date), meals: [] }
        }
        grouped[r.date].meals.push({
          ...r,
          label: MEAL_CONFIG[r.mealType]?.label || r.mealType,
          emoji: MEAL_CONFIG[r.mealType]?.emoji || '🍽️'
        })
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

  previewPhoto(e: any) {
    const url = e.currentTarget.dataset.url
    wx.previewImage({ urls: [url], current: url })
  },

  goLog() { wx.navigateTo({ url: '/pages/diet/log/log' }) }
})
