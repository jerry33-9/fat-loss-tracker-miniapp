import { formatDate, weightChange } from '../../utils/date'
import { getWeights, getGoal } from '../../utils/api'

Page({
  data: {
    records: [] as any[],
    totalRecords: 0,
    trendValues: [] as number[],
    trendLabels: [] as string[],
    targetWeight: 0
  },

  onShow() {
    this.loadRecords()
  },

  async loadRecords() {
    wx.showLoading({ title: '加载中...' })

    try {
      const [weights, goal] = await Promise.all([
        getWeights({ limit: 60 }),
        getGoal()
      ])

      const targetW = goal ? goal.targetWeight : 0

      const records = weights.map((r, i) => ({
        ...r,
        dateLabel: formatDate(r.date),
        diff: i < weights.length - 1
          ? Number(weightChange(r.weight, weights[i + 1].weight))
          : undefined
      }))

      const trendData = weights.slice(0, 14).reverse()
      this.setData({
        records,
        totalRecords: weights.length,
        trendValues: trendData.map(r => r.weight),
        trendLabels: trendData.map(r => r.date.slice(5)),
        targetWeight: targetW
      })

      if (trendData.length > 1) {
        setTimeout(() => this.drawChart(), 200)
      }
    } catch (e) {
      console.error(e)
    } finally {
      wx.hideLoading()
    }
  },

  drawChart() {
    const { trendValues, targetWeight } = this.data
    const query = wx.createSelectorQuery()
    query.select('#weightTrendChart')
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
        const pad = { top: 16, right: 16, bottom: 30, left: 48 }
        const chartW = w - pad.left - pad.right
        const chartH = h - pad.top - pad.bottom

        const minV = Math.min(...trendValues) - 1
        const maxV = Math.max(...trendValues) + 1
        const range = maxV - minV || 1

        ctx.strokeStyle = '#EEEEEE'
        ctx.lineWidth = 0.5
        for (let i = 0; i <= 4; i++) {
          const y = pad.top + (chartH / 4) * i
          ctx.beginPath()
          ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y)
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
        const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH)
        grad.addColorStop(0, 'rgba(0,181,120,0.25)')
        grad.addColorStop(1, 'rgba(0,181,120,0.02)')
        ctx.fillStyle = grad; ctx.fill()

        ctx.beginPath()
        ctx.strokeStyle = '#00B578'; ctx.lineWidth = 2; ctx.lineJoin = 'round'
        points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y))
        ctx.stroke()

        points.forEach(p => {
          ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
          ctx.fillStyle = '#00B578'; ctx.fill()
        })

        if (targetWeight > minV && targetWeight < maxV) {
          const ty = pad.top + chartH - ((targetWeight - minV) / range) * chartH
          ctx.strokeStyle = '#FF4D4F'; ctx.lineWidth = 1
          ctx.setLineDash([4, 3])
          ctx.beginPath()
          ctx.moveTo(pad.left, ty); ctx.lineTo(w - pad.right, ty)
          ctx.stroke()
          ctx.setLineDash([])
        }
      })
  },

  goLog() { wx.navigateTo({ url: '/pages/weight/log/log' }) }
})
