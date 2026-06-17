/** 日期格式化工具 */

function pad(n: number): string {
  return n < 10 ? '0' + n : String(n)
}

/** 获取今天日期 YYYY-MM-DD */
export function today(): string {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** 格式化日期为中文显示 */
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const weekMap = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${d.getMonth() + 1}月${d.getDate()}日 ${weekMap[d.getDay()]}`
}

/** 获取过去 N 天的日期数组 */
export function lastNDays(n: number): string[] {
  const result: string[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    result.push(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`)
  }
  return result
}

/** 计算 BMI */
export function calcBMI(weight: number, heightCm: number): number {
  const h = heightCm / 100
  return Math.round((weight / (h * h)) * 10) / 10
}

/** BMI 分类 */
export function bmiCategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: '偏瘦', color: '#FAAD14' }
  if (bmi < 24) return { label: '正常', color: '#00B578' }
  if (bmi < 28) return { label: '偏胖', color: '#FAAD14' }
  return { label: '肥胖', color: '#FF4D4F' }
}

/** 计算体重变化 */
export function weightChange(current: number, previous: number): string {
  const diff = current - previous
  if (diff > 0) return `+${diff.toFixed(1)}`
  return diff.toFixed(1)
}

/** 计算距目标体重还差多少 */
export function toTarget(current: number, target: number): string {
  const diff = current - target
  if (diff <= 0) return '已达成目标 🎉'
  return `还差 ${diff.toFixed(1)} kg`
}
