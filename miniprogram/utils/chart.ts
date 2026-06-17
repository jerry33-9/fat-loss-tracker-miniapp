/** Canvas 绑图工具 */

interface ChartConfig {
  canvasId: string
  width: number
  height: number
  padding?: { top: number; right: number; bottom: number; left: number }
}

interface LineData {
  points: { x: number; y: number }[]
  color: string
  width?: number
}

/** 绘制简单的折线图 */
export function drawLineChart(
  config: ChartConfig,
  data: { labels: string[]; values: number[]; targetLine?: number },
  options?: {
    lineColor?: string
    fillColor?: string
  }
): void {
  const ctx = wx.createCanvasContext(config.canvasId)
  const { width, height } = config
  const pad = config.padding || { top: 20, right: 20, bottom: 40, left: 50 }

  const lineColor = options?.lineColor || '#00B578'
  const fillColor = options?.fillColor || 'rgba(0,181,120,0.1)'

  const chartW = width - pad.left - pad.right
  const chartH = height - pad.top - pad.bottom

  if (data.values.length === 0) {
    ctx.setFontSize(14)
    ctx.setFillStyle('#999')
    ctx.fillText('暂无数据', width / 2 - 25, height / 2)
    ctx.draw()
    return
  }

  const minVal = Math.min(...data.values) - 1
  const maxVal = Math.max(...data.values) + 1
  const valRange = maxVal - minVal || 1

  // 网格线
  ctx.setStrokeStyle('#EEEEEE')
  ctx.setLineWidth(0.5)
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (chartH / 4) * i
    ctx.beginPath()
    ctx.moveTo(pad.left, y)
    ctx.lineTo(width - pad.right, y)
    ctx.stroke()

    const label = (maxVal - (valRange / 4) * i).toFixed(1)
    ctx.setFontSize(11)
    ctx.setFillStyle('#999')
    ctx.fillText(label, 5, y + 4)
  }

  // 数据点
  const points = data.values.map((v, i) => ({
    x: pad.left + (chartW / (data.values.length - 1 || 1)) * i,
    y: pad.top + chartH - ((v - minVal) / valRange) * chartH
  }))

  // 填充区域
  ctx.beginPath()
  ctx.moveTo(points[0].x, pad.top + chartH)
  points.forEach((p) => ctx.lineTo(p.x, p.y))
  ctx.lineTo(points[points.length - 1].x, pad.top + chartH)
  ctx.closePath()
  ctx.setFillStyle(fillColor)
  ctx.fill()

  // 折线
  ctx.beginPath()
  ctx.setStrokeStyle(lineColor)
  ctx.setLineWidth(2)
  points.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y)
    else ctx.lineTo(p.x, p.y)
  })
  ctx.stroke()

  // 数据点圆
  points.forEach((p) => {
    ctx.beginPath()
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
    ctx.setFillStyle(lineColor)
    ctx.fill()
  })

  // 目标线
  if (data.targetLine !== undefined) {
    const targetY = pad.top + chartH - ((data.targetLine - minVal) / valRange) * chartH
    ctx.setStrokeStyle('#FF4D4F')
    ctx.setLineWidth(1)
    ctx.setLineDash([5, 3])
    ctx.beginPath()
    ctx.moveTo(pad.left, targetY)
    ctx.lineTo(width - pad.right, targetY)
    ctx.stroke()
    ctx.setLineDash([])

    ctx.setFontSize(11)
    ctx.setFillStyle('#FF4D4F')
    ctx.fillText(`目标 ${data.targetLine}kg`, width - pad.right - 60, targetY - 4)
  }

  // X 轴标签
  ctx.setFontSize(10)
  ctx.setFillStyle('#999')
  const step = Math.max(1, Math.floor(data.labels.length / 5))
  data.labels.forEach((label, i) => {
    if (i % step === 0 || i === data.labels.length - 1) {
      const x = pad.left + (chartW / (data.values.length - 1 || 1)) * i
      ctx.fillText(label.slice(5), x - 12, height - pad.bottom + 16)
    }
  })

  ctx.draw()
}
