/**
 * HTTP API 封装
 * 后端自行部署，修改 BASE_URL 指向你的服务器
 */

const BASE_URL = 'https://your-server.com/api'

interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
}

function request<T>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', path: string, data?: any): Promise<T> {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + path,
      method,
      data,
      header: {
        'Content-Type': 'application/json'
      },
      success(res) {
        const body = res.data as ApiResponse<T>
        if (body.code === 0) {
          resolve(body.data)
        } else {
          reject(new Error(body.message || '请求失败'))
        }
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

export function get<T>(path: string) { return request<T>('GET', path) }
export function post<T>(path: string, data?: any) { return request<T>('POST', path, data) }
export function put<T>(path: string, data?: any) { return request<T>('PUT', path, data) }
export function del<T>(path: string) { return request<T>('DELETE', path) }

/** 上传文件 */
export function uploadFile(filePath: string, name = 'file'): Promise<string> {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: BASE_URL + '/upload',
      filePath,
      name,
      success(res) {
        const body = JSON.parse(res.data) as ApiResponse<{ url: string }>
        if (body.code === 0) {
          resolve(body.data.url)
        } else {
          reject(new Error(body.message || '上传失败'))
        }
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

// ---- 体重 API ----

export async function getWeights(params?: { startDate?: string; endDate?: string; limit?: number }) {
  const qs = params ? '?' + Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&') : ''
  return get<WeightRecord[]>('/weights' + qs)
}

export function addWeight(data: { weight: number; date: string; note?: string }) {
  return post<WeightRecord>('/weights', data)
}

// ---- 饮食 API ----

export async function getDiets(params?: { date?: string; startDate?: string; endDate?: string }) {
  const qs = params ? '?' + Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&') : ''
  return get<DietRecord[]>('/diets' + qs)
}

export function addDiet(data: {
  mealType: string
  date: string
  foods: { name: string; amount: string; calories: number }[]
  totalCalories: number
  photoUrls: string[]
  note?: string
}) {
  return post<DietRecord>('/diets', data)
}

// ---- 运动 API ----

export async function getExercises(params?: { startDate?: string; endDate?: string }) {
  const qs = params ? '?' + Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&') : ''
  return get<ExerciseRecord[]>('/exercises' + qs)
}

export function addExercise(data: {
  type: string
  duration: number
  calories: number
  date: string
  note?: string
}) {
  return post<ExerciseRecord>('/exercises', data)
}

// ---- 目标 API ----

export function getGoal() {
  return get<UserGoal | null>('/goal')
}

export function setGoal(data: {
  targetWeight: number
  startWeight: number
  weeklyTarget: number
}) {
  return post<UserGoal>('/goal', data)
}

export function deleteGoal() {
  return del<void>('/goal')
}

// ---- 统计 API ----

export function getStats() {
  return get<{
    totalWeights: number
    totalDiets: number
    totalExercises: number
    streakDays: number
  }>('/stats')
}
