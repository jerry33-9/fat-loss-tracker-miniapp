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
