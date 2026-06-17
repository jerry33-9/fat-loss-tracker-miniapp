import { today, calcBMI, weightChange, toTarget } from '../../utils/date'
import { getWeights, getDiets, getExercises, getGoal } from '../../utils/api'

Page({
  data: {
    currentWeight: 0,
    previousWeight: 0,
    weightDiff: 0,
    targetWeight: 0,
    progressPercent: 0,
    targetText: '',
    todayCalories: 0,
    todayExercise: 0,
    calorieBalance: 0,
    bmi: 0,
    trendLabels: [] as string[],
    trendValues: [] as number[]
  },

  onShow() {
    this.loadDashboard()
  },

  async loadDashboard() {
    const date = today()
    wx.showLoading({ title: '加载中...' })

    try {
      const [weights, diets, exercises, goal] = await Promise.all([
        getWeights({ limit: 30 }),
        getDiets({ date }),
        getExercises({ startDate: date, endDate: date }),
        getGoal()
      ])

      const currentW = weights.length > 0 ? weights[0].weight : 0
      const prevW = weights.length > 1 ? weights[1].weight : 0
      const targetW = goal ? goal.targetWeight : 0

      const totalCal = diets.reduce((sum, d) => sum + d.totalCalories, 0)
      const totalEx = exercises.reduce((sum, e) => sum + e.calories, 0)

      const trendData = weights.slice(0, 14).reverse()
      const labels = trendData.map(r => r.date.slice(5))
      const values = trendData.map(r => r.weight)

      let progress = 0
      let targetText = ''
      if (targetW > 0 && currentW > 0 && goal) {
        const total = goal.startWeight - targetW
        const done = goal.startWeight - currentW
        progress = total > 0 ? Math.min(100, Math.max(0, (done / total) * 100)) : 0
        targetText = toTarget(currentW, targetW)
      }

      this.setData({
        currentWeight: currentW,
        previousWeight: prevW,
        weightDiff: prevW > 0 ? Number(weightChange(currentW, prevW)) : 0,
        targetWeight: targetW,
        progressPercent: Math.round(progress),
        targetText,
        todayCalories: totalCal,
        todayExercise: totalEx,
        calorieBalance: totalCal - totalEx,
        bmi: 0,
        trendLabels: labels,
        trendValues: values
      })

      if (values.length > 0) {
        this.drawChart()
      }
    } catch (e) {
      console.error('加载仪表盘失败', e)
    } finally {
      wx.hideLoading()
    }
  },

  drawChart() {
    const { trendLabels, trendValues, targetWeight } = this.data
    const query = wx.createSelectorQuery()
    query.select('#weightChart')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0]) return
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        const dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        ctx.scale(dpr, dpr)

        const w = res[0].width
        const h = res[0].height
        const pad = { top: 16, right: 16, bottom: 32, left: 48 }
        const chartW = w - pad.left - pad.right
        const chartH = h - pad.top - pad.bottom

        if (trendValues.length === 0) return

        const minV = Math.min(...trendValues) - 1
        const maxV = Math.max(...trendValues) + 1
        const range = maxV - minV || 1

        ctx.strokeStyle = '#EEEEEE'
        ctx.lineWidth = 0.5
        for (let i = 0; i <= 4; i++) {
          const y = pad.top + (chartH / 4) * i
          ctx.beginPath()
          ctx.moveTo(pad.left, y)
          ctx.lineTo(w - pad.right, y)
          ctx.stroke()
        }

        const points = trendValues.map((v, i) => ({
          x: pad.left + (chartW / (trendValues.length - 1 || 1)) * i,
          y: pad.top + chartH - ((v - minV) / range) * chartH
        }))

        ctx.beginPath()
        ctx.moveTo(points[0].x, pad.top + chartH)
        points.forEach(p => ctx.lineTo(p.x, p.y))
        ctx.lineTo(points[points.length - 1].x, pad.top + chartH)
        ctx.closePath()
        const gradient = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH)
        gradient.addColorStop(0, 'rgba(0,181,120,0.25)')
        gradient.addColorStop(1, 'rgba(0,181,120,0.02)')
        ctx.fillStyle = gradient
        ctx.fill()

        ctx.beginPath()
        ctx.strokeStyle = '#00B578'
        ctx.lineWidth = 2
        ctx.lineJoin = 'round'
        points.forEach((p, i) => {
          i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
        })
        ctx.stroke()

        points.forEach(p => {
          ctx.beginPath()
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
          ctx.fillStyle = '#00B578'
          ctx.fill()
        })

        if (targetWeight > minV && targetWeight < maxV) {
          const ty = pad.top + chartH - ((targetWeight - minV) / range) * chartH
          ctx.strokeStyle = '#FF4D4F'
          ctx.lineWidth = 1
          ctx.setLineDash([4, 3])
          ctx.beginPath()
          ctx.moveTo(pad.left, ty)
          ctx.lineTo(w - pad.right, ty)
          ctx.stroke()
          ctx.setLineDash([])
        }
      })
  },

  goWeightLog() { wx.navigateTo({ url: '/pages/weight/log/log' }) },
  goDietLog() { wx.navigateTo({ url: '/pages/diet/log/log' }) },
  goExerciseLog() { wx.navigateTo({ url: '/pages/exercise/log/log' }) },
  goWeight() { wx.switchTab({ url: '/pages/weight/weight' }) },
  goDiet() { wx.switchTab({ url: '/pages/diet/diet' }) },
  goExercise() { wx.switchTab({ url: '/pages/exercise/exercise' }) }
})
